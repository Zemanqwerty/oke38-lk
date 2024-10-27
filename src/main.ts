import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { createMicroservices } from './applications/applications.microservice';

async function bootstrap() {
  if (process.env.DEBUG === 'true') {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, 
    });
    await createMicroservices(app);
    await app.listen(5002);
  } else {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, 
    });
    await createMicroservices(app);
    await app.listen(5000);
  }
}
bootstrap();
