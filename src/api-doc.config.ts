import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import helmet from '@fastify/helmet';
export async function setupApiDoc(
  app: NestFastifyApplication,
  docsPath: string,
  openapiPath: string,
  jwtTokenName: string,
  baseUrl: string,
) {
  // Configure API documentation
  const config = new DocumentBuilder()
    .setTitle('World AI Server API')
    .setDescription('Welcome to World AI')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        description: 'Enter JWT token',
        name: 'JWT',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      jwtTokenName,
    )
    .setExternalDoc('OpenAPI JSON', openapiPath)
    .addServer([baseUrl].join('/'), 'Development server')
    .addServer('', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app as any, config, {
    autoTagControllers: true,
  });

  // Raw OpenAPI JSON at a separate endpoint
  const jsonOpenApiSpec = JSON.stringify(document, null, 2);
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.get(openapiPath, (_, reply) => {
    reply.header('Content-Type', 'application/json').send(jsonOpenApiSpec);
  });

  // When using fastify and helmet, there may be a problem with CSP, to solve this collision, configure the CSP as shown below:
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`, 'https://cdn.jsdelivr.net'],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io', 'https:'],
        scriptSrc: [`'self'`, `'unsafe-inline'`, 'https://cdn.jsdelivr.net'],
        connectSrc: [`'self'`, 'https://cdn.jsdelivr.net'],
      },
    },
  });

  // 注册路由处理函数
  fastifyInstance.get(docsPath, (req: any, reply: any) => {
    apiReference({
      theme: 'default',
      cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
      withFastify: true,
      spec: { url: openapiPath },
    })(req, reply.raw);
  });
}
