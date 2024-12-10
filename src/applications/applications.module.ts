import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { Applications } from './applications.entity';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { FilesModule } from 'src/files/files.module';
import { Files } from '../files/Files.entity';
import { FilesService } from 'src/files/files.service';
import { ChatModule } from 'src/chat/chat.module';
import { CenovayaKategoriya } from './cenovayakategoriya.entity';
import { EnumUrovenU } from './enumurovenu.entity';
import { StatusOplaty } from './statusoplaty.entity';
import { VidRassrochki } from './vidrassrochki.entity';
import { VidZayavki } from './vidzayavki.entity';
import { ZayavkaStatus } from './zayavkaststus.entity';
import { Gp } from './gp.entity';
import { PrichinaPodachi } from './prichinapodachi.entity';
import { FilialsModule } from 'src/filials/filials.module';
import { DocumentsModule } from 'src/docsFiles/documents.module';
import { ApplicationTypes } from './zayavkatype.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderSource } from './ordersource.entity';

@Module({
    imports: [
        ConfigModule,
        UsersModule,
        FilesModule,
        DocumentsModule,
        ChatModule,
        FilialsModule,
        TypeOrmModule.forFeature([Applications, Files, CenovayaKategoriya, EnumUrovenU, StatusOplaty, VidRassrochki, VidZayavki, ZayavkaStatus, Gp, PrichinaPodachi, ApplicationTypes, OrderSource]),
        ClientsModule.registerAsync([
            {
                name: 'APPLICAITIONS_TO_1C_SERVICE',
                useFactory: (configService: ConfigService) => {
                    const user = configService.get('RABBITMQ_USER');
                    const password = configService.get('RABBITMQ_PASSWORD');
                    const host = configService.get('RABBITMQ_HOST');
                    const queueName = configService.get('RABBITMQ_QUEUE_NAME_1C_APPLICATIONS');

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
    providers: [ApplicationsService, FilesService, DocumentsModule],
    controllers: [ApplicationsController],
    exports: [ApplicationsService]
})
export class ApplicationsModule {}
