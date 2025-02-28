import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
  });
  // app.useStaticAssets(join(__dirname, '../public'));
  app.useGlobalPipes(new ValidationPipe());
  // const allowedOrigin = process.env.HOST_URL || '*';

  // app.enableCors({
  //   origin: allowedOrigin,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   allowedHeaders: 'Content-Type, Authorization',
  // });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap();
