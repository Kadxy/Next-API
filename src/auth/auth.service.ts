import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Generate JWT token for a user
   * @param userId The user's unique identifier (uid)
   * @returns JWT token
   */
  async generateToken(userId: string): Promise<string> {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  /**
   * Validate a user by their uid
   * @param uid The user's UUID
   * @returns User object or null
   */
  async validateUser(uid: string) {
    return this.prisma.user.findUnique({
      where: { uid },
      select: {
        id: true,
        uid: true,
        displayName: true,
        email: true,
        isActive: true,
      },
    });
  }
}
