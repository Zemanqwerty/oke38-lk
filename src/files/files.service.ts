import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { LoginUser } from "src/dtos/auth/LoginUser.dto";
import { Payload } from "src/dtos/auth/Payload.dto";
import { ResponseAuth } from "src/dtos/auth/ResponseAuth.dto";
import { Request, Response } from "express";
import { TokensService } from "src/tokens/tokens.service";
import { ApplicationFiles } from "src/dtos/applications/ApplicationFiles.dto";
import { ApplicationsService } from "src/applications/applications.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Files } from "./Files.entity";
import { Repository } from "typeorm";
import { Applications } from "src/applications/applications.entity";
import { time } from "console";



@Injectable()
export class FilesService {
    constructor(
        @InjectRepository(Files)
        private filesRepository: Repository<Files>,
        private usersService: UsersService,
    ) {};

    async saveFiles(files: ApplicationFiles, application: Applications) {
        for (const group in files) {
            for (const file of files[group]) {
                const newFile = new Files();
                newFile.fileType = group;
                newFile.fileName = file.originalname;
                newFile.filePath = file.path;
                newFile.application = application;

                await this.filesRepository.save(newFile);
            }
        }
    }

    async getFilesByApplication(uuid: string) {
        return await this.filesRepository.find({
            relations: {
                application: true
            },
            where: {
                application: {
                    id_zayavka: uuid
                }
            }
        })
    }

    async deleteFilesById(fileId: number) {
        const file = await this.filesRepository.findOne({
            where: {
                id: fileId
            }
        });

        return await this.filesRepository.remove(file);
    }
}