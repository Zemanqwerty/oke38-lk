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
import { Applications } from "./applications.entity";
import { CreateApplication } from "src/dtos/applications/CreateApplication.dto";
import { ApplicationFiles } from "src/dtos/applications/ApplicationFiles.dto";
import { FilesService } from "src/files/files.service";
import { Files } from "src/files/Files.entity";
import { ApplicationsResponse } from "src/dtos/applications/ApplicatonsResponse";


@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Applications)
        private applicationsReposytory: Repository<Applications>,
        @InjectRepository(Files)
        private filesRepository: Repository<Files>,
        private usersService: UsersService,
        private filesService: FilesService,
    ) {};

    async create(userDate: Payload, files: ApplicationFiles, applicationData: CreateApplication) {
        const user = await this.usersService.getUserByEmail(userDate.publickUserEmail);
        
        const newApplication = this.applicationsReposytory.create(applicationData);
        newApplication.user = user;
        await this.applicationsReposytory.save(newApplication);
        await this.filesService.saveFiles(files, newApplication);

        return newApplication;
    }

    async getApplicationsFiles(userData: Payload, applicationId: number) {
        const user = await this.usersService.getUserByEmail(userData.publickUserEmail);
        const application = await this.applicationsReposytory.findOne({
            relations: {
                user: true
            },
            where: {
                id: applicationId
            }
        });

        if (application.user.id !== user.id) {
            throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
        }

        return await this.filesService.getFilesByApplication(applicationId);
    }

    async getApplicationsByUser(userData: Payload) {
        const applications = await this.applicationsReposytory.find({
            where: {
                user: {
                    email: userData.publickUserEmail,
                    isActive: true
                }
            }
        })

        return applications.map((application) => {
            return new ApplicationsResponse(application);
        })
    }

    // async getApplicationById(userData: Payload, id: number) {
    //     const user = await this.usersService.getUserByEmail(userData.publickUserEmail);
    //     const application = await this.applicationsReposytory.findOne({
    //         relations: {
    //             user: true
    //         },
    //         where: {
    //             id: id
    //         }
    //     })

    //     if (user.id !== application.user.id) {
    //         throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
    //     }
    // }
}