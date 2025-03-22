import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions';
import { setupApiDoc } from './api-doc.config';

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
    }),
  );

  // 启用CORS
  app.enableCors();

  // 启动服务器
  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);

  console.log(`---> World AI Server is running on PORT[${port}]`);
  console.log('API DOCS: ', `${BASE_URL}${SCALAR_PATH}`);
  console.log('OPENAPI JSON: ', `${BASE_URL}${OPENAPI_PATH}`);
}

bootstrap();
