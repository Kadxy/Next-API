import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions';
import { setupApiDoc } from './api-doc.config';
import { BusinessException } from './common/exceptions/business.exception';
import { ValidationError } from 'class-validator';

export const BASE_URL = 'http://localhost:9527';
export const SCALAR_PATH = '/scalar';
export const OPENAPI_PATH = '/openapi';
export const JWT_TOKEN_NAME = 'jwt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  setupApiDoc(app, SCALAR_PATH, OPENAPI_PATH, JWT_TOKEN_NAME, BASE_URL);

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

  // 启用CORS
  app.enableCors({ origin: true, credentials: true });

  // 启动服务器
  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);

  console.log(`---> World AI Server is running on PORT[${port}]`);
  console.log('API DOCS: ', `${BASE_URL}${SCALAR_PATH}`);
  console.log('OPENAPI JSON: ', `${BASE_URL}${OPENAPI_PATH}`);
}

bootstrap();
