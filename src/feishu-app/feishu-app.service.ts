import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as Lark from '@larksuiteoapi/node-sdk';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { UserService } from 'src/identity/user/user.service';

type EventHandlers = Parameters<
  InstanceType<typeof Lark.EventDispatcher>['register']
>[0];
type ImMessageReceiveV1Handler = EventHandlers['im.message.receive_v1'];
type ImMessageReceiveV1Event = Parameters<ImMessageReceiveV1Handler>[0];
type ImChatAccessEventHandler =
  EventHandlers['im.chat.access_event.bot_p2p_chat_entered_v1'];
type ImChatAccessEvent = Parameters<ImChatAccessEventHandler>[0];

@Injectable()
export class FeishuAppService implements OnModuleInit {
  private readonly logger: Logger = new Logger(FeishuAppService.name);

  // 客户端
  private readonly client: Lark.Client;
  private readonly wsClient: Lark.WSClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {
    const config = {
      appId: this.configService.getOrThrow('FEISHU_APP_ID'),
      appSecret: this.configService.getOrThrow('FEISHU_APP_SECRET'),
      loggerLevel: Lark.LoggerLevel.debug,
    };

    this.client = new Lark.Client(config);
    this.wsClient = new Lark.WSClient(config);
  }

  onModuleInit() {
    this.wsClient
      .start({
        eventDispatcher: new Lark.EventDispatcher({}).register({
          'im.message.receive_v1': this.handleNewMessage,
          'im.chat.access_event.bot_p2p_chat_entered_v1':
            this.handleBotEnteredP2pChat,
        }),
      })
      .catch((err) => this.logger.error('Feishu WS Client error', err));
  }

  private handleNewMessage = async (data: ImMessageReceiveV1Event) => {
    const {
      sender: {
        sender_id: { union_id: unionId },
      },
      message: { chat_id, content },
    } = data;

    const user = await this.userService.getUserByFeishuId(unionId);

    await this.client.im.v1.message.create({
      params: {
        receive_id_type: 'chat_id',
      },
      data: {
        receive_id: chat_id,
        content: Lark.messageCard.defaultCard({
          title: `回复： ${JSON.parse(content).text}`,
          content: `您好, ${user.displayName || '您还没有绑定飞书帐号, 请前往控制台(http://localhost:5173/account)绑定.'}`,
        }),
        msg_type: 'interactive',
      },
    });
  };

  private handleBotEnteredP2pChat = async (data: ImChatAccessEvent) => {
    const { chat_id } = data;
    await this.client.im.v1.message.create({
      params: {
        receive_id_type: 'chat_id',
      },
      data: {
        receive_id: chat_id,
        content: Lark.messageCard.defaultCard({
          title: '欢迎加入聊天',
          content: '你好, 欢迎加入聊天',
        }),
        msg_type: 'interactive',
      },
    });
  };
}
