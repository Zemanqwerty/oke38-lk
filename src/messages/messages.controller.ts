import { Body, Controller, Get, Param, Post, Req, Res, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { LoginUser } from "src/dtos/auth/LoginUser.dto";
import { Request, Response } from "express";
import { get } from "http";
import { MessagesService } from "./messages.service";
import { AuthGuard } from "src/auth/auth.middleware";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Payload } from "src/dtos/auth/Payload.dto";
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { MessagesFiles } from "src/dtos/messages/messagesFiles.dto";
import { MessagesFileData } from "src/dtos/messages/MessagesFileData.dto";



@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {};

    @UseGuards(AuthGuard)
    @Get(':id/get')
    async logout(@Req() request: Request, @Param() params: any) {
        try {
            return await this.messagesService.getAllMessagesInChat(params.id)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post(':id/sendFiles')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'files', maxCount: 5 },
    ], {
        storage: diskStorage({
            destination: (req, file, callback) => {
                const user: Payload = req['user'];
                const destination = `./messageFiles/${user.publickUserEmail}`;
                fs.mkdirSync(destination, { recursive: true });
                callback(null, destination);
            },
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + uuidv4();
                callback(null, `${uniqueSuffix}__${file.originalname}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            // Разрешаем только изображения и PDF-документы
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || 'image/jpg' || file.mimetype === 'application/pdf') {
                callback(null, true);
            } else {
                callback(new Error('Unsupported file type'), false);
            }
        }
    }))
    async create(@Req() request: Request, @UploadedFiles() files: MessagesFiles, @Body() fileData: MessagesFileData, @Param() params: any) {
        try {
            console.log(files);
            return await this.messagesService.saveMessagesFiles(files, fileData.userRole, fileData.user, params.id);
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}