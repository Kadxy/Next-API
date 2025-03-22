import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/exceptions';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

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

  console.log(`World AI Server is running on port: ${port}`);
}

bootstrap();
