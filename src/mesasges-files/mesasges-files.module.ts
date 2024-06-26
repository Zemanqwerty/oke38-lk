// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ApplicationsModule } from 'src/applications/applications.module';
// import { ChatModule } from 'src/chat/chat.module';
// import { FilesModule } from 'src/files/files.module';
// import { UsersModule } from 'src/users/users.module';
// import { MessagesFiles } from './messages-files.entity';

// @Module({
//     imports: [
//         UsersModule,
//         FilesModule,
//         ChatModule,
//         ApplicationsModule,
//         TypeOrmModule.forFeature([MessagesFiles]),
//         ],
//     providers: [MessagesService, ChatGateway],
//     exports: [MessagesService],
//     controllers: [MessagesController]
// })
// export class MesasgesFilesModule {}
