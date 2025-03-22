import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

export function setupApiDoc(
  app: INestApplication,
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

  // Setup OpenAPI JSON route
  app.use(openapiPath, (_req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(document, null, 2));
  });

  // Configure Scalar API Reference
  app.use(
    docsPath,
    apiReference({
      theme: 'default',
      spec: {
        url: openapiPath,
      },
      cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
    }),
  );
}
