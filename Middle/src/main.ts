// import * as dotenv from 'dotenv';
// import { resolve } from 'path';
// dotenv.config({ path: resolve(__dirname, '../.env') });
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// // import { GoogleAuthGuard } from './Guard/GoogleAuthGuard';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.enableCors();
//   // app.setGlobalPrefix('api');
//   // app.useGlobalGuards(app.get(GoogleAuthGuard));         // globally use guard, do not enable if you dont know exactly

  
//   const config = new DocumentBuilder()
//     .setTitle('Cats example')
//     .setDescription('The cats API description')
//     .setVersion('1.0')
//     .addTag('cats')
//     .build();
//   const documentFactory = () => SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('api', app, documentFactory);

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000); // ✅ This will now work
}
bootstrap();

