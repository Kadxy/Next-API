import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupApiDoc(
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
    .addServer([baseUrl].join('/'), 'Current server')
    .build();

  const document = SwaggerModule.createDocument(app, config, {});

  // Setup Swagger documentation with built-in UI
  SwaggerModule.setup(docsPath, app, document);

  // Also provide raw OpenAPI JSON at a separate endpoint
  const jsonOpenApiSpec = JSON.stringify(document, null, 2);
  const fastifyInstance = app.getHttpAdapter().getInstance();
  fastifyInstance.get(openapiPath, (_, reply) => {
    reply.header('Content-Type', 'application/json').send(jsonOpenApiSpec);
  });
}
