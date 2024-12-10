import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { createMicroservices } from './applications/applications.microservice';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {

  const user = process.env.RABBITMQ_USER;
  const password = process.env.RABBITMQ_PASSWORD;
  const host = process.env.RABBITMQ_HOST;

  if (process.env.DEBUG === 'true') {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true, 
    });

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@${host}`], // URL вашего RabbitMQ сервера
        queue: '1C_AppModified', // Первая очередь
        queueOptions: {
          durable: true, // Настройки очереди
        },
      },
    });

    // await createMicroservices(app);
    await app.startAllMicroservices();

    await app.listen(5002);
  } else {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    });

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@${host}`], // URL вашего RabbitMQ сервера
        queue: '1C_AppModified', // Первая очередь
        queueOptions: {
          durable: true, // Настройки очереди
        },
      },
    });

    // await createMicroservices(app);
    await app.startAllMicroservices();

    await app.listen(5000);
  }
}
bootstrap();
