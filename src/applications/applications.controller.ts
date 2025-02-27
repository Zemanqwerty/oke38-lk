import { Body, Controller, Delete, Get, Param, Post, Put, Query, Redirect, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
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
import { Request } from 'express';

import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { Payload } from "src/dtos/auth/Payload.dto";
import { SetApplicationFilial } from "src/dtos/applications/SetApplicationFilial.dto";
import { SetApplicationNumberStatus } from "src/dtos/applications/SetApplicationNumberStatus";
import { MessagePattern, RmqContext, Payload as MicroservicesPayload, Ctx, EventPattern } from "@nestjs/microservices";
import { EditDogovorEnergoData } from "src/dtos/applications/SetDogovorEnergo.dto";
import { DogovorFilesDto } from "src/dtos/applications/DogovorFiles.dto";
import { filter } from "rxjs";



@Controller('applications')
export class ApplicationsController {
    constructor(private readonly applicationsService: ApplicationsService) {};

    @UseGuards(AuthGuard)
    @Post('dogovorenergo/:id/setfiles')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'paymentFile', maxCount: 1 },
        { name: 'dogovorFile', maxCount: 1 },
      ], {
        storage: diskStorage({
            destination: (req, file, callback) => {
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
    async setDogovorFiles(@Req() request: Request, @UploadedFiles() files: DogovorFilesDto, @Param() params: any) {
        try {
            console.log(files);
            return await this.applicationsService.setDogovorFiles(request['user'], files, params.id);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post('')
    @UseInterceptors(FileFieldsInterceptor([
        { name: '10', maxCount: 2 },
        { name: '8', maxCount: 2 },
        { name: '5', maxCount: 2 },
        { name: '6', maxCount: 2 },
        { name: '7', maxCount: 2 },
        { name: '9', maxCount: 2 },
        { name: '0', maxCount: 5 },
      ], {
        storage: diskStorage({
            destination: (req, file, callback) => {
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

    // @MessagePattern({ cmd: 'applicationFrom1c' })
    // async createApplicationFrom1c(@MicroservicesPayload() application: Applications, @Ctx() context: RmqContext) {
    //     const channel = context.getChannelRef();
    //     const originalMsg = context.getMessage();

    //     channel.ack(originalMsg);
    //     console.log(originalMsg);

    //     // return await this.applicationsService.
    // }

    // @MessagePattern('1C_AppModified')
    // async applicationFrom1c(data: any) {
    //     try {
    //         return await this.applicationsService.crateApplicationFrom1c(data);
    //     } catch (e) {
    //         console.log(e);
    //         return e
    //     }
    // }

    // @EventPattern() // Обработчик для очереди
    // async handleIncomingMessageK(@MicroservicesPayload() data: any) {
    //     console.log('Received message from 1c:', data);
    //     // Здесь вы можете обработать входящее сообщение из очереди K
    // }

    @MessagePattern() // Обработчик для первой очереди
    async handle1cMessage(@MicroservicesPayload() data: any) {
      try {
        console.log('Получено сообщение от 1С:', data);
        return await this.applicationsService.saveApplicationFrom1C(data);
      } catch (e) {
        return e
      }
    }

    @UseGuards(AuthGuard)
    @Get(':uuid/sendTo1c')
    async sendApplicationTo1C(@Req() request: Request, @Param() params: any) {
        try {
            return await this.applicationsService.sendApplicationTo1c(request['user'], params.uuid);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('dogovorenergo/:id/files')
    async getDogovorFiles(@Req() request: Request, @Param() params: any) {
        try {
            return await this.applicationsService.getDogovorFiles(request['user'], params.id);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('dogovorenergo')
    async getAllDogovorenergoForApplications(@Req() request: Request, @Query('page') page: number) {
        try {
            return await this.applicationsService.getAllDogovorenergoForApplications(request['user'], page);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('dogovorenergo/:id')
    async getDogovorenergoByApplicationId(@Req() request: Request, @Param('id') id: string) {
        try {
            return await this.applicationsService.getDogovorenergoByApplicationId(request['user'], id);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('contract/:id')
    async getContractByApplicationId(@Req() request: Request, @Param('id') id: string) {
        try {
            return await this.applicationsService.getContractDataByApplicationId(request['user'], id);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post(':uuid/addFiles')
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
    async addApplicationFiles(@Req() request: Request, @UploadedFiles() files: ApplicationFiles, @Param() params: any) {
        try {
            // return await this.applicationsService.addApplicationFiles(request['user'], params.uuid, files);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post('dogovorenergo/:id/edit')
    async editDogovorDataByApplicationId (@Req() request: Request, @Param() params: any, @Body() dogovorData: EditDogovorEnergoData) {
        try {
            return await this.applicationsService.editDogovorEnergoDataByApplicationId(request['user'], params.id, dogovorData)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post(':id/edit')
    async editApplicationData(@Req() request: Request, @Param() params: any, @Body() applicationData: CreateApplication) {
        try {
            return await this.applicationsService.editApplication(request['user'], params.id, applicationData)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('application/:id')
    async getApplicationById(@Req() request: Request, @Param() params: any) {
        try {
            return await this.applicationsService.getApplicationByIdForClient(request['user'], params.id)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Delete(':id/deleteFile/:fileId')
    async deleteApplicationFile(@Req() request: Request, @Param() params: any) {
        try {
            // return await this.applicationsService.deleteApplicationFiles(request['user'], params.id, params.fileId)
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

    @UseGuards(AuthGuard)
    @Get('count')
    async getApplicationsCount(@Req() request: Request) {
        try {
            return await this.applicationsService.getApplicationsCount(request['user']);
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('applicationstatus')
    async getAllApplicationStatus(@Req() request: Request) {
        try {
            return await this.applicationsService.getAllApplicationStatus(request['user']);
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('dogovorenergocount')
    async getAllDogovorEnergoCount(@Req() request: Request) {
        try {
            return await this.applicationsService.getDogovorEnergoCount(request['user']);
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get(':id/setview')
    async setView(@Req() request: Request, @Param() params: any) {
        try {
            return await this.applicationsService.setView(request['user'], params.id);
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('all')
    async getAllApplications(
        @Req() request: Request,
        @Query('page') page: number,
        @Query('address') address: string,
        @Query('user') user: string,
        @Query('filial') filial: string,
        @Query('number') number: string,
        @Query('vidrassrochki') vidrassrochki: number,
        @Query('statusoplaty') statusoplaty: number,
        @Query('applicationstatus') applicationstatus: number,
        @Query('contractstatus') contractstatus: number,
    ) {
        try {
            const filters = {
                address,
                user,
                filial,
                number,
                vidrassrochki,
                statusoplaty,
                applicationstatus,
                contractstatus
            };
            console.log(filters);
            return await this.applicationsService.getAllApplications(request['user'], page, filters);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('allcontractstatuses')
    async getAllContractStatuses(@Req() request: Request) {
        try {
            return await this.applicationsService.getAllContractStatuses();
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post(':id/filial')
    async setApplicationFilial(@Req() request: Request, @Param() params: any, @Body() data: SetApplicationFilial) {
        try {
            return await this.applicationsService.setFilial(request['user'], data, params.id)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('vidrassrochki')
    async getAllVidrassrochki(@Req() request: Request) {
        try {
            // console.log('--------------------------');
            return await this.applicationsService.getAllVidrassrochki(request['user']);
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('getStatuses')
    async getStatusesForApplications(@Req() request: Request) {
        try {
            return await this.applicationsService.getApplicationsStatuses(request['user']);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('statusoplaty')
    async getAllStatusOplaty(@Req() request: Request) {
        try {
            return await this.applicationsService.getAllStatusOplaty(request['user']);
        } catch (e) {
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Post(':id/numberstatus')
    async setApplicationNumberStatus(@Req() request: Request, @Param() params: any, @Body() data: SetApplicationNumberStatus) {
        try {
            return await this.applicationsService.setNumberStatus(request['user'], data, params.id)
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get('getFilials')
    async getFilialsForApplication(@Req() request: Request) {
        try {
            return await this.applicationsService.getFilialsForApplication(request['user']);
        } catch (e) {
            console.log(e);
            return e
        }
    }

    @UseGuards(AuthGuard)
    @Get(':id/workingFiles')
    async getApplicationWorkingFiles(@Req() request: Request, @Param() params: any) {
        try {
            return await this.applicationsService.getApplicationWorkingDocs(request['user'], params.id);
        } catch (e) {
            console.log(e);
            return e
        }
    }
}