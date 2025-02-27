import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hash, compare } from 'bcryptjs';
import { Repository } from "typeorm";
import { CreateUser } from "src/dtos/users/CreateUser.dto";
import { ResponseUser } from "src/dtos/users/ResponseUser.dto";
import { Payload } from "src/dtos/auth/Payload.dto";
import { Users } from "src/users/users.entity";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";
import { ResponseAuth } from "src/dtos/auth/ResponseAuth.dto";
import { Message } from "./messages.entity";
import { Role } from "src/roles/roles.enum";
import { strict } from "assert";
import { Chat } from "src/chat/chat.entity";
import { ChatService } from "src/chat/chat.service";
import { ApplicationsService } from "src/applications/applications.service";
import { ResponseMessages } from "src/dtos/messages/ResponseMessages.dto";
import { MessagesFiles } from "src/dtos/messages/messagesFiles.dto";
import { ChatGateway } from "./messages.gateway";
import { LastMesages } from "src/dtos/messages/LastMessages.dto";


@Injectable()
export class MessagesService {
    constructor(
        private chatService: ChatService,
        private applicationService: ApplicationsService,
        private usersService: UsersService,
        private messageGateway: ChatGateway,
        @InjectRepository(Message)
        private messageRepository: Repository<Message>,
    ) {};

    async createMessage(message: string, userRole: Role, userEmail: string, chatId: string) {
        let chat = await this.chatService.getChatById(chatId);
        console.log(chatId);

        if (!chat) {
            const application = await this.applicationService.getApplicationById(chatId);
            if (application) {
              chat = await this.chatService.createChat(application); // Обновляем переменную chat
            } else {
              throw new Error('Application not found'); // Обработка случая, если заявка не найдена
            }
        }

        console.log('--');
        console.log(chat);
        console.log('--');

        const user = await this.usersService.getActivatedUserByEmail(userEmail);

        const newMessage = this.messageRepository.create({
            messageText: message,
            // senderRole: userRole,
            sender: user,
            chat: chat,
        });

        return await this.messageRepository.save(newMessage);
    }

    async saveMessagesFiles(files: MessagesFiles, userRole: Role, userEmail: string, chatId: string) {
        let chat = await this.chatService.getChatById(chatId);

        if (!chat) {
            const application = await this.applicationService.getApplicationById(chatId);
            if (application) {
              chat = await this.chatService.createChat(application); // Обновляем переменную chat
            } else {
              throw new Error('Application not found'); // Обработка случая, если заявка не найдена
            }
        }

        console.log(files);

        const user = await this.usersService.getActivatedUserByEmail(userEmail)

        return files.files.map(async (file) => {
            const newFile = this.messageRepository.create({
                fileName: file.filename,
                fileUrl: file.path,
                // senderRole: userRole,
                sender: user,
                chat: chat
            })

            await this.messageRepository.save(newFile)

            return this.messageGateway.sendFileMessage(chatId.toString(), new ResponseMessages(newFile))
        })
    }

    async getAllMessagesInChat(chatId: string) {
        const messages = await this.messageRepository.find({
            relations: {
                chat: true,
                sender: {
                    id_userrole: true
                }
            },
            where: {
                chat: {
                    application: {
                        id_zayavka: chatId
                    }
                }
            },
            order: {
                createdAt: 'ASC'
            }
        })

        console.log(messages);

        return messages.map((message) => {
            return new ResponseMessages(message);
        })
    }

    async getLastMessages() {
        const messages = await this.messageRepository.createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('sender.id_userrole', 'userRole')
        .leftJoinAndSelect('message.chat', 'chat')
        .leftJoinAndSelect('chat.application', 'application')
        .leftJoinAndSelect('application.filial', 'filial')
        .where('sender.id_userrole.id_userrole = :caption_userrole', { caption_userrole: 0 })
        .orderBy('message.createdAt', 'DESC')
        .getMany();

        return messages.map((message) => {
            return new LastMesages(message);
        })
    }

    async getAllMessagesCount() {
        const messages = await this.messageRepository.createQueryBuilder('message')
        .leftJoinAndSelect('message.sender', 'sender')
        .leftJoinAndSelect('sender.id_userrole', 'userRole')
        .where('sender.id_userrole.id_userrole = :caption_userrole', { caption_userrole: 0 })
        .getMany();

        // console.log(messages.length);

        return messages.length;
    }
}