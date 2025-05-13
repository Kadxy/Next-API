import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Passkey, User } from '../../../../prisma/generated/prisma/client';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import type {
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  VerifiedRegistrationResponse,
} from '@simplewebauthn/server';
import { BusinessException } from '../../../common/exceptions';
import { CACHE_KEYS, getCacheKey } from '../../../core/cache/chche.constant';
import { UserService } from '../../user/user.service';
import { JwtTokenService } from '../jwt.service';
import { removeUserExcludedFields } from 'src/identity/user/dto/user.dto';

@Injectable()
export class PasskeyService {
  private readonly logger = new Logger(PasskeyService.name);

  /**
   * Human-readable title for your website
   */
  private readonly rpName: string;

  /**
   * A unique identifier for your website.
   * 'localhost' is okay for local dev
   */
  private readonly rpID: string;

  /**
   * The URL at which registrations and authentications should occur.
   * 'http://localhost' and 'http://localhost:PORT' are also valid.
   * Do NOT include any trailing /
   */
  private readonly origin: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService,
    @Inject(CACHE_MANAGER)
    private readonly cacheService: Cache,
  ) {
    this.rpName = this.configService.getOrThrow<string>('WEBAUTHN_RP_NAME');
    this.rpID = this.configService.getOrThrow<string>('WEBAUTHN_RP_ID');
    this.origin = this.configService.getOrThrow<string>('WEBAUTHN_ORIGIN');
  }

  //////////////////////////////////////////////////////
  // Registration: analogous to new account creation. //
  //////////////////////////////////////////////////////

  /**
   * Generate registration options
   * One endpoint (GET) needs to return the result of a call to generateRegistrationOptions():
   * These options can be passed directly into @simplewebauthn/browser's startRegistration() method.
   */
  async generateRegistrationOptions(user: User) {
    const { id: userId, uid: userUid } = user;

    // 1. Retrieve any of the user's previously-registered authenticators
    const userPasskeys = await this.getUserPasskeys(userId);

    // 2. Generate registration options
    const options: PublicKeyCredentialCreationOptionsJSON =
      await generateRegistrationOptions({
        rpName: this.rpName,
        rpID: this.rpID,
        userName: userUid.replaceAll('-', ''), // 使用UID去除`-`作为UserName
        // Don't prompt users for additional information about the authenticator
        // (Recommended for smoother UX)
        attestationType: 'none',
        // Prevent users from re-registering existing authenticators
        excludeCredentials: userPasskeys.map((passkey) => ({
          id: passkey.id,
          // Optional
          transports: this.parseTransports(passkey.transports),
        })),
        // See "Guiding use of authenticators via authenticatorSelection" below
        authenticatorSelection: {
          // Defaults
          residentKey: 'preferred',
          userVerification: 'preferred',
          // Optional
          authenticatorAttachment: 'platform',
        },
      });

    // 3. Remember these options for the user - save to cache
    const cacheKey = getCacheKey(CACHE_KEYS.WEBAUTHN_REGISTER_OPTIONS, userId);
    await this.cacheService.set<PublicKeyCredentialCreationOptionsJSON>(
      cacheKey,
      options,
      CACHE_KEYS.WEBAUTHN_REGISTER_OPTIONS.EXPIRE,
    );

    // 5. Return the options
    return options;
  }

  /**
   * Verify registration response
   * The second endpoint (POST) should accept the value returned by @simplewebauthn/browser's
   * startRegistration() method and then verify it:
   */
  async verifyRegistrationResponse(
    userId: User['id'],
    response: RegistrationResponseJSON,
  ) {
    // 1. Get `options.challenge` that was saved above
    const cacheKey = getCacheKey(CACHE_KEYS.WEBAUTHN_REGISTER_OPTIONS, userId);
    const options =
      await this.cacheService.get<PublicKeyCredentialCreationOptionsJSON>(
        cacheKey,
      );
    if (!options) {
      throw new BusinessException(
        'Registration challenge expired or not found',
      );
    }

    // 2. Verify registration response
    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: options.challenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
    });
    const { verified, registrationInfo } = verification;

    if (!verified) {
      throw new BusinessException('Passkey registration verification failed');
    }

    // 3. Save Passkey
    await this.createPasskey(userId, options, registrationInfo);
  }

  //////////////////////////////////////////////////////////
  // Authentication: analogous to existing account login. //
  //////////////////////////////////////////////////////////

  /**
   * Generate authentication options
   * One endpoint (GET) needs to return the result of a call to generateAuthenticationOptions():
   */
  async generateAuthenticationOptions() {
    // 0. 生成一个基于时间戳的唯一标识
    const state = new Date().getTime() + Math.floor(Math.random() * 1000000);

    // 1. Generate authentication options
    const options: PublicKeyCredentialRequestOptionsJSON =
      await generateAuthenticationOptions({
        rpID: this.rpID,
        // Require users to use a previously-registered authenticator
        // In this case, allow user select any passkey
        allowCredentials: [],

        // 如果用户没有验证身份，会报错 Error: User verification required, but user could not be verified
        // 比如 MacBook 的 Touch ID 在盒盖时，会报错，需要显示设置为 required
        userVerification: 'required',
      });

    // 3. Remember this challenge for this user
    const cacheKey = getCacheKey(
      CACHE_KEYS.WEBAUTHN_AUTHENTICATION_OPTIONS,
      state,
    );
    await this.cacheService.set<PublicKeyCredentialRequestOptionsJSON>(
      cacheKey,
      options,
      CACHE_KEYS.WEBAUTHN_AUTHENTICATION_OPTIONS.EXPIRE,
    );

    // 5. Return the options
    return { state, options };
  }

  /**
   * Verify authentication response
   * The second endpoint (POST) should accept the value returned by @simplewebauthn/browser's
   * startAuthentication() method and then verify it:
   */
  async verifyAuthenticationResponse(
    state: string,
    response: AuthenticationResponseJSON,
  ) {
    // this.logger.debug(`verifyAuthenticationResponse: ${state}`);

    // 1. Get `options.challenge` that was saved above
    const cacheKey = getCacheKey(
      CACHE_KEYS.WEBAUTHN_AUTHENTICATION_OPTIONS,
      state,
    );

    const options =
      await this.cacheService.get<PublicKeyCredentialRequestOptionsJSON>(
        cacheKey,
      );
    if (!options) {
      throw new BusinessException(
        'Authentication challenge expired or not found',
      );
    }

    // 2. Get passkey
    const passkey = await this.getPasskey(response.id);
    if (!passkey) {
      throw new BusinessException('Passkey not found');
    }
    this.logger.debug(
      `id: ${passkey.id}, publicKey: ${passkey.publicKey}, counter: ${passkey.counter}, transports: ${passkey.transports}`,
    );

    // 3. Verify authentication response
    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response,
        expectedChallenge: options.challenge,
        expectedOrigin: this.origin,
        expectedRPID: this.rpID,
        credential: {
          id: passkey.id,
          publicKey: passkey.publicKey,
          counter: Number(passkey.counter),
          transports: this.parseTransports(passkey.transports),
        },
      });
    } catch (error) {
      this.logger.error(`Passkey authentication error: ${error.message}`);
      throw new BusinessException(error.message);
    }

    const { verified, authenticationInfo } = verification;

    if (!verified) {
      throw new BusinessException('Passkey Authentication failed');
    }

    // 4. Update passkey counter asynchronously
    this.updatePasskeyCounter(
      passkey.id,
      authenticationInfo.newCounter,
    ).catch();

    // 5. Find the user and generate token
    const user = await this.userService.getUserById(passkey.userId);
    const token = await this.jwtTokenService.sign(user);

    // 6. Return the user and token
    return { user: removeUserExcludedFields(user), token };
  }

  ////////////////////////
  // Passkey Management //
  ////////////////////////

  /**
   * 获取用户的所有 passkeys - 管理员
   * @param userId 用户ID
   */
  private async getUserPasskeys(userId: User['id']) {
    return this.prisma.passkey.findMany({
      where: { userId, isDeleted: false },
      select: { id: true, transports: true },
    });
  }

  /**
   * 获取用户的所有 passkeys - 展示给用户
   * @param userId 用户ID
   */
  async listUserPasskeys(userId: User['id']) {
    return this.prisma.passkey.findMany({
      where: { userId, isDeleted: false },
      select: {
        id: true,
        displayName: true,
        createdAt: true,
        updatedAt: true,
        lastUsedAt: true,
      },
    });
  }

  /**
   * 更新 passkey 的 displayName
   * @param userId 用户ID
   * @param passkeyId passkey ID
   * @param displayName 新的 displayName
   */
  async updatePasskeyDisplayName(
    userId: User['id'],
    passkeyId: Passkey['id'],
    displayName: Passkey['displayName'],
  ) {
    return this.prisma.passkey.update({
      where: { id: passkeyId, userId, isDeleted: false },
      data: { displayName },
    });
  }

  /**
   * 删除用户的 passkey
   * @param userId 用户ID
   * @param passkeyId passkey ID
   */
  async deletePasskey(userId: User['id'], passkeyId: Passkey['id']) {
    // not return, because it contains bigint type, which cannot be serialized
    await this.prisma.passkey.update({
      where: { id: passkeyId, userId, isDeleted: false },
      data: { isDeleted: true },
    });
  }

  /**
   * 获取用户的 passkey
   * @param id passkey ID
   */
  private async getPasskey(id: Passkey['id']) {
    return this.prisma.passkey.findUnique({ where: { id, isDeleted: false } });
  }

  //////////////////////////////////////////
  // Post-authentication responsibilities //
  //////////////////////////////////////////

  /**
   * Post-registration responsibilities
   * Assuming `verification.verified` is true then RP's must, at the very least,
   * save the credential data in registrationInfo to the database:
   */
  private async createPasskey(
    userId: User['id'],
    options: PublicKeyCredentialCreationOptionsJSON,
    info: VerifiedRegistrationResponse['registrationInfo'],
  ) {
    const { credential, credentialDeviceType, credentialBackedUp } = info;

    await this.prisma.passkey.create({
      data: {
        userId,

        // Created by `generateRegistrationOptions()` in Step 1
        webAuthnUserID: options.user.id,

        // A unique identifier for the credential
        id: credential.id,

        // The public key bytes, used for subsequent authentication signature verification
        publicKey: credential.publicKey,

        // The number of times the authenticator has been used on this site so far
        counter: BigInt(credential.counter),

        // How the browser can talk with this credential's authenticator
        transports: this.stringifyTransports(credential.transports),

        // Whether the passkey is single-device or multi-device
        deviceType: credentialDeviceType,

        // Whether the passkey has been backed up in some way
        backedUp: credentialBackedUp,
      },
    });
  }

  /**
   * 更新 passkey 计数器和最后使用时间
   * @param passkeyId passkey ID
   * @param newCounter 新的计数器
   */
  private async updatePasskeyCounter(
    passkeyId: Passkey['id'],
    newCounter: number,
  ) {
    return this.prisma.passkey.update({
      where: { id: passkeyId, isDeleted: false },
      data: { counter: BigInt(newCounter), lastUsedAt: new Date() },
    });
  }

  ////////////////////////
  // Helper Functions //
  ////////////////////////

  /**
   * 解析 transports
   * @param transports
   * @returns {AuthenticatorTransportFuture[]} 解析后的 transports 数组
   */
  private parseTransports(transports: string): AuthenticatorTransportFuture[] {
    if (!transports || transports === '[]') {
      return [];
    }
    try {
      return JSON.parse(transports);
    } catch (error) {
      this.logger.error(`Failed to parse transports: ${error}`);
      return [];
    }
  }

  private stringifyTransports(
    transports: AuthenticatorTransportFuture[],
  ): string {
    try {
      return JSON.stringify(transports);
    } catch (error) {
      this.logger.error(`Failed to stringify transports: ${error}`);
      return '[]';
    }
  }
}
