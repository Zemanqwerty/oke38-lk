// import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
// import { InjectRepository } from "@nestjs/typeorm";
// import { hash, compare } from 'bcryptjs';
// import { Repository } from "typeorm";
// import { CreateUser } from "src/dtos/users/CreateUser.dto";
// import { ResponseUser } from "src/dtos/users/ResponseUser.dto";
// import { Payload } from "src/dtos/auth/Payload.dto";
// import { Users } from "src/users/users.entity";
// import { JwtService } from "@nestjs/jwt";
// import { UsersService } from "src/users/users.service";
// import { ResponseAuth } from "src/dtos/auth/ResponseAuth.dto";
// import { Role } from "src/roles/roles.enum";
// import { strict } from "assert";
// import { Chat } from "src/chat/chat.entity";
// import { ChatService } from "src/chat/chat.service";
// import { ApplicationsService } from "src/applications/applications.service";
// import { ResponseMessages } from "src/dtos/messages/ResponseMessages.dto";
// import { MessagesFiles } from "src/dtos/messages/messagesFiles.dto";
// import { ChatGateway } from "./messages.gateway";


// @Injectable()
// export class MessagesService {
//     constructor(
//         private chatService: ChatService,
//         private applicationService: ApplicationsService,
//         @InjectRepository(Message)
//         private messageRepository: Repository<Message>,
//     ) {};

//     async createMessage(message: string, userRole: Role, user: string, chatId: number) {
//         const chat = await this.chatService.getChatById(chatId);

//         if (!chat) {
//             await this.applicationService.getApplicationById(chatId).then((application) => {
//                 this.chatService.createChat(application);
//             })
//         }

//         const newMessage = this.messageRepository.create({
//             messageText: message,
//             senderRole: userRole,
//             sender: user,
//             chat: chat,
//         });

//         return await this.messageRepository.save(newMessage);
//     }

//     async saveMessagesFiles(files: MessagesFiles, userRole: Role, user: string, chatId: number) {
//         const chat = await this.chatService.getChatById(chatId);

//         if (!chat) {
//             await this.applicationService.getApplicationById(chatId).then((application) => {
//                 this.chatService.createChat(application);
//             })
//         }

//         console.log(files);

//         return files.files.map(async (file) => {
//             const newFile = this.messageRepository.create({
//                 fileName: file.filename,
//                 fileUrl: file.path,
//                 senderRole: userRole,
//                 sender: user,
//                 chat: chat
//             })

//             return await this.messageRepository.save(newFile)
//         })
//     }

//     async getAllMessagesInChat(chatId: string) {
//         const messages = await this.messageRepository.find({
//             relations: {
//                 chat: true
//             },
//             where: {
//                 chat: {
//                     application: {
//                         id: parseInt(chatId)
//                     }
//                 }
//             },
//             order: {
//                 createdAt: 'ASC'
//             }
//         })

//         return messages.map((message) => {
//             return new ResponseMessages(message);
//         })
//     }
// }