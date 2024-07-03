/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors({
    origin: [
      'http://localhost:5173', 
      'https://localhost:5173', 
      'http://localhost:3000', 
      'https://localhost:3000', 
      'https://client-production-34ee.up.railway.app'
    ], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('FemCodersClub')
    .setDescription('This API provides a CRUD for the FemCodersClub web')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);
  Logger.log(`NestJS server is running on port ${process.env.PORT || 3000}`);
}
bootstrap();



















>>>>>>> 1f8f392aab479e14329e9314b8ccda7244605556
