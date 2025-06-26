import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe with transform enabled
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strips unknown properties
      forbidNonWhitelisted: true, // throws error for unknown properties
      transform: true,            // transforms payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // allows implicit type conversion
      },
    })
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('ShopieApp')
    .setDescription('The Shopie e-commerce platform API documentation')
    .addTag('users', 'User management endpoints')
    .addTag('products', 'Product management endpoints')
    .addTag('carts', 'Shopping cart endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // CORS for Angular frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api/docs`);
}

bootstrap();
