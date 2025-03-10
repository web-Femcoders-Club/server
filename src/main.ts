/* eslint-disable prettier/prettier */
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe, Logger } from '@nestjs/common';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import * as bodyParser from 'body-parser';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   app.enableCors({
//     origin: [
//       'http://localhost:5173',
//       'https://localhost:5173',
//       'http://localhost:3000',
//       'https://localhost:3000',
//       'https://client-production-34ee.up.railway.app',
//       'https://www.femcodersclub.com',
//       'https://femcodersclub.com',
//     ],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     credentials: true,
//   });

//   app.use(bodyParser.json({ limit: '5mb' }));
//   app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  

//   app.useGlobalPipes(new ValidationPipe());

//   const config = new DocumentBuilder()
//     .setTitle('FemCodersClub')
//     .setDescription('This API provides a CRUD for the FemCodersClub web')
//     .setVersion('1.0')
//     .addBearerAuth({
//       type: 'http',
//       scheme: 'bearer',
//       bearerFormat: 'JWT',
//       in: 'header',
//     })
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, document);

//   await app.listen(process.env.PORT || 3000);
//   Logger.log(`NestJS server is running on port ${process.env.PORT || 3000}`);
// }

// bootstrap();

/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://localhost:5173',
      'http://localhost:3000',
      'https://localhost:3000',
      'https://client-production-34ee.up.railway.app',
      'https://www.femcodersclub.com',
      'https://femcodersclub.com',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

  // ✅ Agregamos soporte para servir archivos en `uploads/`
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.useGlobalPipes(new ValidationPipe());

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

