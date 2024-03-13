import { Body, Controller, Get, Param, Post, Redirect, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUser } from "src/dtos/users/CreateUser.dto";
import { AuthGuard } from "src/auth/auth.middleware";
import { RequestForResetPassword } from "src/dtos/users/RequestForResetPassword.dto";
import { ResetPassword } from "src/dtos/users/ResetPassword.dto";
import { ApplicationsService } from "./applications.service";
import { CreateApplication } from "src/dtos/applications/CreateApplication.dto";
import { Express } from 'express';
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { ApplicationFiles } from "src/dtos/applications/ApplicationFiles.dto";

import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Payload } from "src/dtos/auth/Payload.dto";



@Controller('applications')
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) {};

    @UseGuards(AuthGuard)
    @Post('')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'applicationCopy', maxCount: 2 },
        { name: 'passportCopy', maxCount: 2 },
        { name: 'planeCopy', maxCount: 2 },
        { name: 'ownDocsCopy', maxCount: 2 },
        { name: 'powerOfAttorneyCopy', maxCount: 2 },
        { name: 'constituentDocsCopy', maxCount: 2 },
        { name: 'otherDocs', maxCount: 5 },
      ], {
        storage: diskStorage({
            destination: (req, file, callback) => {
                console.log(123);
              const user: Payload = req['user'];
              const destination = `./files/${user.publickUserEmail}`;
              fs.mkdirSync(destination, {recursive: true});
              callback(null, destination);
            },
            filename: (req, file, callback) => {
              const uniqueSuffix = Date.now() + '-' + uuidv4();
              callback(null, `${uniqueSuffix}__${file.originalname}`);
            },
          })
      })
    )
    async create(@Req() request: Request, @UploadedFiles() files: ApplicationFiles, @Body() applicationData: CreateApplication) {
        try {
            console.log(files);
            console.log(applicationData);
            return await this.applicationsService.create(request['user'], files, applicationData);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('')
    async getApplicationsByUser(@Req() request: Request) {
        try {
            return await this.applicationsService.getApplicationsByUser(request['user']);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    // @UseGuards(AuthGuard)
    // @Get(':id')
    // async getApplicationById(@Req() request: Request, @Param() params: any) {
    //     try {
    //         return await this.applicationsService.getApplicationById(request['user'], params.id);
    //     } catch (e) {
    //         console.log(e);
    //         return e
    //     }
    // }

    @UseGuards(AuthGuard)
    @Get(':id/files')
    async getApplicationsFiles(@Req() request: Request, @Param() params: any) {
        try {
            return await this.applicationsService.getApplicationsFiles(request['user'], params.id);
        } catch (e) {
            console.log(e);
            return e
        }
    }
}