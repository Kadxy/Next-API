import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getTencentSESErrorMessage } from 'src/core/feishu-webhook/feishu-webhook.constant';
import { FeishuWebhookService } from 'src/core/feishu-webhook/feishu-webhook.service';
import * as tencentcloud from 'tencentcloud-sdk-nodejs';
import * as process from 'node:process';

@Injectable()
export class TencentEmailService {
  private readonly logger = new Logger(TencentEmailService.name);
  private readonly sesClient: any;
  private readonly fromAddress: string;
  private readonly fromName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly feishuWebhookService: FeishuWebhookService,
  ) {
    try {
      const secretId = this.configService.getOrThrow<string>(
        'TENCENT_CLOUD_SECRET_ID',
      );
      const secretKey = this.configService.getOrThrow<string>(
        'TENCENT_CLOUD_SECRET_KEY',
      );
      const region = this.configService.getOrThrow<string>(
        'TENCENT_SES_REGION',
        'ap-guangzhou',
      );
      this.fromAddress = this.configService.getOrThrow<string>(
        'TENCENT_SES_FROM_ADDRESS',
      );
      this.fromName = this.configService.getOrThrow<string>(
        'TENCENT_SES_FROM_NAME',
      );

      const SesClient = tencentcloud.ses.v20201002.Client;
      const clientConfig = {
        credential: { secretId, secretKey },
        region: region,
        profile: { httpProfile: { endpoint: 'ses.tencentcloudapi.com' } },
      };

      this.sesClient = new SesClient(clientConfig);
      this.logger.log('Tencent Email Service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Tencent Email Service:', error);
      process.exit(1);
    }
  }

  async sendLoginCode(email: string, code: string) {
    const data = {
      code,
      productName: 'Next API',
      expiryTime: '5 分钟',
      verificationPath: `login?email_verification_callback=1&email=${email}&code=${code}`,
      logoPath: 'favicon.ico',
    };

    try {
      const params = {
        FromEmailAddress: `"${this.fromName}" <${this.fromAddress}>`,
        Destination: [email],
        Subject: 'Next API Login Code',
        Template: {
          TemplateID: Number(
            this.configService.getOrThrow<string>(
              'TENCENT_SES_LOGIN_CODE_TEMPLATE_ID',
            ),
          ),
          TemplateData: JSON.stringify(data),
        },
      };

      await this.sesClient.SendEmail(params);
    } catch (error) {
      this.logger.error(`Failed to send, error: ${error?.stack}`);
      this.feishuWebhookService
        .sendPost(getTencentSESErrorMessage(email, error))
        .catch();
      throw error;
    }
  }
}
