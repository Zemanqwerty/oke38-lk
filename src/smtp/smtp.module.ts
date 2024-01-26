import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SmtpService } from './smtp.service';

@Module({
    imports: [
        ConfigModule,
        ClientsModule.registerAsync([
            {
                name: 'SMTP_SERVICE',
                useFactory: (configService: ConfigService) => {
                    const user = configService.get('RABBITMQ_USER');
                    const password = configService.get('RABBITMQ_PASSWORD');
                    const host = configService.get('RABBITMQ_HOST');
                    const queueName = configService.get('RABBITMQ_QUEUE_NAME');

                    return {
                        transport: Transport.RMQ,
                        options: {
                            urls: [`amqp://${user}:${password}@${host}`],
                            queue: queueName,
                            queueOptions: {
                                durable: true,
                            },
                        },
                    };
                },
                inject: [ConfigService],
            },
        ]),
    ],
    providers: [SmtpService],
    exports: [SmtpService],
})
export class SmtpModule {}