import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter, BusinessException } from './common/exceptions';
import { setupApiDoc } from './api-doc.config';
import { ValidationError } from 'class-validator';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCsrf from '@fastify/csrf-protection';
import helmet from '@fastify/helmet';
import compression from '@fastify/compress';
import { constants as ZlibConstants } from 'zlib';

// Swagger API Docs
export const BASE_URL = 'http://localhost:9527';
export const SCALAR_PATH = '/scalar';
export const OPENAPI_PATH = '/openapi';
export const JWT_TOKEN_NAME = 'jwt';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    {
      logger: new ConsoleLogger({ prefix: 'Nest', timestamp: true }),
    },
  );
  const configService = app.get(ConfigService);

  // Compression: https://docs.nestjs.com/techniques/compression#use-with-fastify
  await app.register(compression, {
    brotliOptions: {
      params: { [ZlibConstants.BROTLI_PARAM_QUALITY]: 4 },
    },
    encodings: ['br', 'gzip', 'deflate'],
  });

  //CSRF Protection: https://docs.nestjs.com/security/csrf
  await app.register(fastifyCsrf);

  // Helmet: https://docs.nestjs.com/security/helmet
  await app.register(helmet);

  // CORS: https://docs.nestjs.com/security/cors
  // Config: https://github.com/expressjs/cors#configuration-options
  app.enableCors({
    origin: true,
    credentials: true,
    maxAge: 365 * 24 * 60 * 60,
    methods: '*',
  });

  // 应用全局响应转换拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // 应用全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 应用验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const firstError = validationErrors[0];
        const message =
          firstError && firstError.constraints
            ? Object.values(firstError.constraints)[0]
            : 'Validation failed';
        throw new BusinessException(message);
      },
    }),
  );

  setupApiDoc(app, SCALAR_PATH, OPENAPI_PATH, JWT_TOKEN_NAME, BASE_URL);

  // 启动服务器
  const port = configService.getOrThrow<number>('PORT');
  const listenHost = configService.getOrThrow<string>('LISTEN_HOST');
  await app.listen(port, listenHost);

  console.log(`---> World AI Server is running on PORT[${port}]`);
  console.log('API DOCS: ', `${BASE_URL}${SCALAR_PATH}`);
  console.log('OPENAPI JSON: ', `${BASE_URL}${OPENAPI_PATH}`);
}

bootstrap();
