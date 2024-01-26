import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    // origin: ['http://localhost:3000'],
    origin: ['http://2.60.115.218:3010'],
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true
  })
  await app.listen(5010);
}
bootstrap();
