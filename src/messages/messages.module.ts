import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';
import { Files } from 'src/files/Files.entity';
import { FilesService } from 'src/files/files.service';
import { Message } from './messages.entity';
import { MessagesService } from './messages.service';
import { ChatService } from 'src/chat/chat.service';
import { ChatModule } from 'src/chat/chat.module';
import { ChatGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';
import { ApplicationsModule } from 'src/applications/applications.module';

@Module({
    imports: [
        UsersModule,
        FilesModule,
        ChatModule,
        ApplicationsModule,
        TypeOrmModule.forFeature([Message]),
        ],
    providers: [MessagesService, ChatGateway],
    exports: [MessagesService],
    controllers: [MessagesController]
})
export class MessagesModule {}
