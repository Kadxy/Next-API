import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  AIModelNonStreamResponse,
  AIModelRequest,
  AIModelStreamResponse,
  AIModelUsage,
} from './interfaces/proxy.interface';
import { TransactionService } from '../../transaction/transaction.service';
import { ApiKey, LLMModel, UpstreamConfig } from '@prisma-main-client/client';
import { APICallException } from '../../common/exceptions';
import { Cron, CronExpression } from '@nestjs/schedule';
import { extractTokenUsage } from 'src/transaction/dto/transaction-context';
import { OpenAIContext } from './interfaces/openai-context.interface';
import { TiktokenService } from 'src/transaction/tiktoken/tiktoken.service';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ProxyBaseService } from '../common/proxy-base.service';
import { UpstreamProvider } from '@prisma-detail-client/client';
import { UlidService } from 'src/core/ulid/ulid.service';

interface RetryInfo {
  count: number;
  excludeIds: UpstreamConfig['id'][];
}

@Injectable()
export class OpenAIService
  extends ProxyBaseService<
    AIModelRequest,
    AIModelNonStreamResponse | AIModelStreamResponse | NodeJS.ReadableStream,
    OpenAIContext
  >
  implements OnModuleDestroy
{
  protected readonly paths = {
    chatCompletions: '/v1/chat/completions',
  };
  protected readonly provider = UpstreamProvider.OPENAI;

  public readonly maxRetryTime = 3;
  private models: Map<string, LLMModel> = new Map();

  constructor(
    protected readonly prisma: PrismaService,
    protected readonly httpService: HttpService,
    protected readonly transactionService: TransactionService,
    private readonly tiktokenService: TiktokenService,
    private readonly ulidService: UlidService,
  ) {
    super(prisma, httpService, transactionService);
  }

  async onModuleInit() {
    // 调用父类方法加载上游配置
    await super.onModuleInit();

    // 加载LLM模型
    await this.loadModels();
  }

  async onModuleDestroy() {
    this.models.clear();
    this.upstreams.clear();
  }

  createContext(
    requestBody: AIModelRequest,
    apiKey: ApiKey,
    clientIp: string,
    userAgent: string,
    externalTraceId: string,
  ): OpenAIContext {
    const context = new OpenAIContext();

    // 1. 基础信息
    context.businessId = this.ulidService.generate();
    context.userId = apiKey.creatorId;
    context.walletId = apiKey.walletId;
    context.apiKeyId = apiKey.id;
    context.clientIp = clientIp;
    context.userAgent = userAgent;
    context.externalTraceId = externalTraceId;
    context.startTime = new Date();
    context.requestBody = requestBody;

    // 2. 检查模型
    this.getCheckedModel(context, requestBody.model);

    // 3. 判断是否流式(默认非流式)
    context.stream = requestBody.stream || false;

    return context;
  }

  forwardRequest(request: AIModelRequest, context: OpenAIContext) {
    if (context.stream) {
      return this.forwardStreamRequest(request, context);
    } else {
      return this.forwardNonStreamRequest(request, context);
    }
  }

  ///////////////
  //  请求转发  //
  ///////////////

  // 发送非流式请求到上游
  private async sendNonStreamToUpstream(
    body: AIModelRequest,
    context: OpenAIContext,
    retry: RetryInfo = { count: 0, excludeIds: [] },
  ): Promise<AIModelNonStreamResponse> {
    const { id, url, config } = await this.getUpstream(
      context,
      retry.excludeIds,
      this.paths.chatCompletions,
    );

    // 记录使用的上游ID
    context.upstreamId = id;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, config),
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Upstream request failed: ${error.message}`);

      // 使用结构化方式记录上游错误
      context.addUpstreamError(error.message, {
        upstreamId: id,
        statusCode: error.response?.status,
        retryCount: retry.count,
      });

      if (retry.count < this.maxRetryTime) {
        return this.sendNonStreamToUpstream(body, context, {
          count: retry.count + 1,
          excludeIds: [...retry.excludeIds, id],
        });
      } else {
        throw new APICallException(context);
      }
    }
  }

  // 发送流式请求到上游
  private async sendStreamToUpstream(
    body: AIModelRequest,
    context: OpenAIContext,
    retry: RetryInfo = { count: 0, excludeIds: [] },
  ): Promise<NodeJS.ReadableStream> {
    const { id, url, config } = await this.getUpstream(
      context,
      retry.excludeIds,
      this.paths.chatCompletions,
    );

    // 记录使用的上游ID
    context.upstreamId = id;

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, body, {
          ...config,
          responseType: 'stream',
          maxRedirects: 0,
          decompress: true,
        }),
      );

      // 确保流有正确的事件处理
      const upstreamStream = response.data;

      // 添加流的基本日志和错误处理
      upstreamStream.on('error', (error: unknown) => {
        this.logger.error(
          `[${context.businessId}] raw stream error: ${error instanceof Error ? error.message : error}`,
        );
        // 记录流处理中的内部错误
        context.addInternalError(
          `Stream processing error: ${error instanceof Error ? error.message : error}`,
          'stream_handling',
        );
      });

      upstreamStream.on('end', () => {
        this.logger.debug(`[${context.businessId}] raw stream ended`);
      });

      return upstreamStream;
    } catch (error) {
      this.logger.error(`Upstream stream request failed: ${error.message}`);

      // 使用结构化方式记录上游错误
      context.addUpstreamError(error.message, {
        upstreamId: id,
        statusCode: error.response?.status,
        retryCount: retry.count,
      });

      if (retry.count < this.maxRetryTime) {
        return this.sendStreamToUpstream(body, context, {
          count: retry.count + 1,
          excludeIds: [...retry.excludeIds, id],
        });
      } else {
        throw new APICallException(context);
      }
    }
  }

  ////////////////////////////////////
  //  请求结束, 计算token, 写入数据库  //
  ///////////////////////////////////

  // 封装的流式处理方法：返回带有计费逻辑的流处理器
  async createStreamHandler(
    body: AIModelRequest,
    context: OpenAIContext,
  ): Promise<{
    upstreamStream: NodeJS.ReadableStream;
    dataCollector: string[];
    processTransaction: (
      isError?: boolean,
      errorMessage?: string,
    ) => Promise<void>;
  }> {
    let upstreamStream: NodeJS.ReadableStream;

    try {
      upstreamStream = await this.sendStreamToUpstream(body, context);
    } catch (error) {
      // 如果所有上游都失败，设置为免费并创建失败记录
      this.logger.error(
        `All upstreams failed for ${context.businessId}: ${error.message}`,
      );

      context.endTime = new Date();
      context.setNoCharge();

      // 异步创建失败记录，不阻塞错误响应
      setImmediate(() => {
        this.createRecords(context)
          .then(() => {
            this.logger.debug(
              `Failed transaction recorded for ${context.businessId} (No Charge)`,
            );
          })
          .catch((recordError) => {
            this.logger.error(
              `Failed to record transaction for ${context.businessId}: ${recordError.message}`,
            );
          });
      });

      // 重新抛出异常，让controller处理
      throw error;
    }

    const dataCollector: string[] = [];
    let isTransactionProcessed = false;

    const processTransaction = async (
      isError = false,
      errorMessage?: string,
    ) => {
      if (isTransactionProcessed) return;
      isTransactionProcessed = true;

      context.endTime = new Date();

      // 同步设置错误状态
      if (isError) {
        // 根据错误类型决定是否免费
        if (
          errorMessage?.includes('timeout') ||
          errorMessage?.includes('unavailable')
        ) {
          context.setNoCharge();
        } else {
          context.addInternalError(errorMessage);
        }

        this.logger.debug(
          `Failed transaction processed for ${context.businessId}: ${errorMessage} (No Charge: ${context.noCharge})`,
        );
      }

      // 异步处理数据库操作，不阻塞
      setImmediate(async () => {
        try {
          if (isError) {
            // 创建失败记录
            await this.createRecords(context);
          } else {
            const fullResponse = dataCollector.join('');
            await this.processStreamTransaction(body, fullResponse, context);
          }
        } catch (err) {
          this.logger.error(
            `Failed to process transaction for ${context.businessId}: ${err.message}`,
          );
        }
      });
    };

    return {
      upstreamStream,
      dataCollector,
      processTransaction,
    };
  }

  // 处理流式计费
  private async processStreamTransaction(
    body: AIModelRequest,
    fullResponse: string,
    context: OpenAIContext,
  ): Promise<void> {
    try {
      // 1. 解析SSE格式的响应，提取所有内容
      const { text, usage } = this.parseSSEResponse(fullResponse);
      context.responseText = text; // 存储提取的文本

      // 2. 获取 token 使用量
      // 如果上游返回了 usage 信息，直接使用
      if (usage) {
        const { prompt_tokens, completion_tokens } = usage;
        context.input_tokens = prompt_tokens;
        context.output_tokens = completion_tokens;
      } else {
        // 否则使用 tiktoken 计算 tokens
        try {
          const tokenResult = await this.tiktokenService.countTokens(
            body,
            text,
          );
          const { input_tokens, output_tokens } = tokenResult;
          context.input_tokens = input_tokens;
          context.output_tokens = output_tokens;
        } catch (tokenError) {
          // 记录token计算错误
          context.addInternalError(
            `Token calculation failed: ${tokenError.message}`,
            'tiktoken_service',
          );
          // 设置默认值避免计费失败
          context.input_tokens = 0;
          context.output_tokens = 0;
        }
      }

      // #无需手动计算费用, context 会根据设置的数据(llmModel, input_tokens, output_tokens等)自动计算

      // 3. 记录计费
      await this.createRecords(context);

      this.logger.debug(
        `Stream transaction recorded for ${context.businessId}`,
      );
    } catch (error) {
      // 记录处理流式交易时的内部错误
      context.addInternalError(
        `Stream transaction processing failed: ${error.message}`,
        'transaction_processing',
      );

      this.logger.error(
        `Stream transaction failed for ${context.businessId}, ${error?.message}`,
      );
    }
  }

  private async processNonStreamTransaction(
    body: AIModelRequest,
    response: AIModelNonStreamResponse,
    context: OpenAIContext,
  ): Promise<void> {
    try {
      // 1. 提取并存储响应中的文本内容
      const responseText = this.extractResponseText(response);
      context.responseText = responseText;

      // 2.1 尝试提取响应中的 token 用量
      const usage = extractTokenUsage(response);
      if (usage) {
        const { prompt_tokens, completion_tokens } = usage;
        context.input_tokens = prompt_tokens;
        context.output_tokens = completion_tokens;
      } else {
        // 2.2 不存在则使用 tiktoken 计算
        try {
          const { input_tokens, output_tokens } =
            await this.tiktokenService.countTokens(body, responseText);

          context.input_tokens = input_tokens;
          context.output_tokens = output_tokens;
        } catch (tokenError) {
          // 记录token计算错误
          context.addInternalError(
            `Token calculation failed: ${tokenError.message}`,
            'tiktoken_service',
          );
          // 设置默认值避免计费失败
          context.input_tokens = 0;
          context.output_tokens = 0;
        }
      }

      // 3. 记录计费
      await this.createRecords(context);

      this.logger.debug(
        `Non-stream transaction recorded for ${context.businessId}`,
      );
    } catch (error) {
      // 记录处理非流式交易时的内部错误
      context.addInternalError(
        `Non-stream transaction processing failed: ${error.message}`,
        'transaction_processing',
      );

      this.logger.error(
        `Non-stream transaction failed for ${context.businessId}, ${error?.message}`,
      );
    }
  }

  ///////////////
  //  解析响应  //
  ///////////////

  // 解析 SSE 响应，返回文本内容和用量信息
  private parseSSEResponse(sseData: string): {
    text: string;
    usage: null | AIModelUsage;
  } {
    const lines = sseData.split('\n');
    const contents: string[] = [];
    let usage: AIModelUsage | null = null;

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const json = JSON.parse(data) as AIModelStreamResponse;

          // 提取所有可能的内容字段
          if (json?.choices) {
            for (const choice of json.choices) {
              // 流式响应的 delta
              if (choice.delta?.content) {
                contents.push(choice.delta.content);
              }
              if (choice.delta?.reasoning_content) {
                contents.push(choice.delta.reasoning_content);
              }
            }
          }

          // 如果响应包含 usage 信息，提取出来
          if (json?.usage) {
            usage = json?.usage;
          }
        } catch {
          // 忽略解析错误的行
        }
      }
    }

    return { text: contents.join(''), usage };
  }

  // 提取响应中的文本内容
  private extractResponseText(response: AIModelNonStreamResponse): string {
    if (!response.choices || response.choices.length === 0) return '';

    const texts: string[] = [];

    for (const choice of response.choices) {
      // 提取普通 content
      if (choice.message?.content) {
        texts.push(choice.message.content);
      }

      // 提取 reasoning_content（某些模型 如 deepseek 会返回）
      if (choice.message?.reasoning_content) {
        texts.push(choice.message.reasoning_content);
      }
    }

    return texts.join('\n');
  }

  ///////////////
  //  请求转发  //
  ///////////////

  async forwardNonStreamRequest(
    body: AIModelRequest,
    context: OpenAIContext,
  ): Promise<AIModelNonStreamResponse> {
    try {
      // 1. 转发请求
      const response = await this.sendNonStreamToUpstream(body, context);

      // 2. 记录结束时间
      context.endTime = new Date();

      // 3. 存储响应体
      context.responseBody = response;

      // 4. 异步处理计费, 不阻塞响应
      setImmediate(() => {
        this.processNonStreamTransaction(body, response, context).catch(
          (error) => {
            this.logger.error(
              `Async non-stream transaction processing failed for ${context.businessId}: ${error.message}`,
            );
          },
        );
      });

      return response;
    } catch (error) {
      // 记录结束时间和错误信息
      context.endTime = new Date();

      // 根据错误类型决定是否免费
      if (
        error.message?.includes('no available upstream') ||
        error.message?.includes('timeout') ||
        error.message?.includes('ENOTFOUND') ||
        error.message?.includes('ECONNREFUSED')
      ) {
        // 系统/网络错误，设置为免费
        context.setNoCharge();
      } else {
        // 其他错误，可能需要收费
        context.addInternalError(error.message || 'Non-stream request failed');
      }

      this.logger.error(
        `Non-stream request failed for ${context.businessId}: ${error.message} (No Charge: ${context.noCharge})`,
      );

      // 异步创建失败记录，不阻塞错误响应
      setImmediate(() => {
        this.createRecords(context)
          .then(() => {
            this.logger.debug(
              `Failed non-stream transaction recorded for ${context.businessId} (No Charge: ${context.noCharge})`,
            );
          })
          .catch((recordError) => {
            this.logger.error(
              `Failed to record non-stream transaction for ${context.businessId}: ${recordError.message}`,
            );
          });
      });

      throw error;
    }
  }

  async forwardStreamRequest(
    body: AIModelRequest,
    context: OpenAIContext,
  ): Promise<NodeJS.ReadableStream> {
    // 1. 检查模型
    this.getCheckedModel(context, body.model);

    // 2. 存储请求体到 context
    context.requestBody = body;

    // 3. 发送请求
    try {
      return await this.sendStreamToUpstream(body, context);
    } catch (error) {
      context.endTime = new Date();
      throw error;
    }
  }

  ///////////////
  //  模型管理  //
  ///////////////

  @Cron(CronExpression.EVERY_5_MINUTES)
  private async loadModels() {
    await this.prisma.main.lLMModel
      .findMany()
      .then((m) => m.forEach((m) => this.models.set(m.name, m)));

    this.logger.log(`✅ Loaded ${this.models.size} LLM models`);
  }

  private getCheckedModel(context: OpenAIContext, name: string): void {
    const modelInfo = this.models.get(name);

    if (!modelInfo) {
      throw new APICallException(context, `model ${name} not supported`);
    }

    context.model = name;
    context.llmModel = modelInfo;
  }
}
