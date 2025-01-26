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
import { Role } from "src/roles/roles.enum";
import { strict } from "assert";
import { Chat } from "./chat.entity";
import { Applications } from "src/applications/applications.entity";


@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private chatRepository: Repository<Chat>,
    ) {};

    async createChat(application: Applications) {
        const newChat = this.chatRepository.create({
            application: application,
        })

        return await this.chatRepository.save(newChat);
    }

    async getChatById(chatId: string) {
        return await this.chatRepository.findOne({
            relations: {
                application: true
            },
            where: {
                application: {
                    id_zayavka: chatId
                }
            }
        })
    }
}
