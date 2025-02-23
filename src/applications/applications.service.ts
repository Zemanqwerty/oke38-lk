import { HttpException, HttpStatus, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { hash, compare } from 'bcryptjs';
import { Repository, LessThan, QueryBuilder, DataSource, getManager } from "typeorm";
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
import { Role } from "src/roles/roles.enum";
import { SetApplicationFilial } from "src/dtos/applications/SetApplicationFilial.dto";
import { SetApplicationNumberStatus } from "src/dtos/applications/SetApplicationNumberStatus";
import { ChatService } from "src/chat/chat.service";
import { ApplicationStatus } from "./applicationsStatus.enum";
import { CenovayaKategoriya } from "./cenovayakategoriya.entity";
import { EnumUrovenU } from "./enumurovenu.entity";
import { StatusOplaty } from "./statusoplaty.entity";
import { VidRassrochki } from "./vidrassrochki.entity";
import { VidZayavki } from "./vidzayavki.entity";
import { time } from "console";
import { ZayavkaStatus } from "./zayavkaststus.entity";
import { Gp } from "./gp.entity";
import { PrichinaPodachi } from "./prichinapodachi.entity";
import { FilialService } from "src/filials/filials.service";
import { DocumentsService } from "src/docsFiles/documents.service";
import {v4 as uuidv4} from 'uuid';
import { ApplicationTypes } from "./zayavkatype.entity";
import { ClientProxy } from "@nestjs/microservices";
import { OrderSource } from "./ordersource.entity";
import { DogovorEnergoDto } from "src/dtos/applications/DogovorEnergo.dto";
import { EditDogovorEnergoData } from "src/dtos/applications/SetDogovorEnergo.dto";
import { ContractResponseDto } from "src/dtos/applications/ContractResponse.dto";
import { DogovorFilesDto } from "src/dtos/applications/DogovorFiles.dto";
import { ContractFilesDto } from "src/dtos/applications/ContractFiles.dto";
import { VidRassrochkiDto } from "src/dtos/applications/Vidrassrochki.dto";
import { StatusOplatyResponse } from "src/dtos/applications/StatusOplatyResponse.dto";
import { ApplicationStatusResponse } from "src/dtos/applications/ApplicationStatus.dto";
import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from "rxjs";

interface RpcCallHeader {
    Method: string;
    BackQueueName: string;
    Body: {
      RpcParams: { [key: string]: string };
    };
  }

@Injectable()
export class ApplicationsService {
    constructor(
        @InjectRepository(Applications)
        private applicationsReposytory: Repository<Applications>,

        @InjectRepository(CenovayaKategoriya)
        private cenKatReposytory: Repository<CenovayaKategoriya>,

        @InjectRepository(EnumUrovenU)
        private enumUReposytory: Repository<EnumUrovenU>,

        @InjectRepository(StatusOplaty)
        private statusOplatyReposytory: Repository<StatusOplaty>,

        @InjectRepository(VidRassrochki)
        private vidRassrochkiReposytory: Repository<VidRassrochki>,

        @InjectRepository(VidZayavki)
        private vidZayavkiReposytory: Repository<VidZayavki>,

        @InjectRepository(ZayavkaStatus)
        private zayavkaStatusReposytory: Repository<ZayavkaStatus>,

        @InjectRepository(ApplicationTypes)
        private applicationTypeRepository: Repository<ApplicationTypes>,

        // @InjectRepository(Files)
        // private filesRepository: Repository<Files>,
        
        @InjectRepository(Gp)
        private gpRepository: Repository<Gp>,

        @InjectRepository(PrichinaPodachi)
        private prichinaPodachiRepository: Repository<PrichinaPodachi>,

        @InjectRepository(OrderSource)
        private orderSourceRepository: Repository<OrderSource>,

        private usersService: UsersService,
        private documentsService: DocumentsService,
        private chatService: ChatService,
        private filialService: FilialService,

        @Inject('APPLICAITIONS_TO_1C_SERVICE') private application1cService: ClientProxy,
        @Inject('1C_RPC') private clientRpc: ClientProxy,
    ) {};

    async getAllDogovorenergoForApplications(userData: Payload, pageNumber: number) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        }

        const allDogovorEnergo = await this.documentsService.getAllDogovorenergo(pageNumber);

        return Promise.all(allDogovorEnergo.map((dogovor) => {
            return new DogovorEnergoDto(dogovor);
        }))
    }

    async getDogovorenergoByApplicationId(userData: Payload, id: string) {
        console.log(id);
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        }

        const dogovorEnergo = await this.documentsService.getDogovorEnergoByApplicationId(id);

        return new DogovorEnergoDto(dogovorEnergo);
    }

    async editDogovorEnergoDataByApplicationId(userData: Payload, applicationId: string, dogovorData: EditDogovorEnergoData){
        console.log(dogovorData);
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        }

        const dogovor = await this.documentsService.getDogovorEnergoByApplicationId(applicationId);
        const application = await this.applicationsReposytory.findOne({
            where: {
                id_zayavka: applicationId
            }
        });

        if (!dogovor) {
            return await this.documentsService.createNewDogovorEnergo(dogovorData, application);
        }

        return await this.documentsService.setDogovorEnergoData(dogovorData, application);
    }

    async getContractDataByApplicationId(userData: Payload, applicationId: string) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        }

        const application = await this.applicationsReposytory.findOne({
            where: {
                id_zayavka: applicationId
            }
        })

        const contract = await this.documentsService.getContractDataByApplication(application);
        console.log(contract);
        return new ContractResponseDto(contract);
    }

    async sendApplicationTo1c(userData: Payload, applicationUUID: string) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        }

        console.log('start to send application in 1c');

        try {
            const application = await this.applicationsReposytory.findOne({
                relations: {
                    user: true,
                    documents: true,
                    contract: true,
                    filial: true,
                },
                where: {
                    id_zayavka: applicationUUID
                }
            })
            return await this.application1cService.send(
                { cmd: 'createApplication' },
                {
                    Z_Date: application.createdAt,                         //Z.Дата КАК Z_Date
                    _Fld26191: application.user.id_usertype.id_usertype == 1 ? application.user.yl_fullname : application.user.user_nameingrid,                             //Z.ФИО КАК _Fld26191
                    _Fld26200:null,                                               //Z.ЭнергопринимающееУстройство КАК _Fld26200
                    _Fld26201: application.address,                             //Z.АдресЭнергопринимающихУстройств КАК _Fld26201
                    _Fld26206: <number>application.maxPower,             //Z.МаксимальнаяМощность КАК _Fld26206
                    _Fld26210RRef: application.v1c_statuszayavki == null ? "" : application.v1c_statuszayavki.toString(),         //Z.СтатусЗаявки КАК _Fld26210RRef
                    _Fld26216: application.user.phoneNumber,                                     //Z.Телефон КАК _Fld26216
                    _Fld26403: application.applicationNumber,                        //Z.НомерЗаявки КАК _Fld26403
                    _Fld26434: application.user.id_usertype.id_usertype == 2 ? 1 : 0,                    //Z.флЯвляетсяИП КАК _Fld26434
                    _Fld27973: application.is_vremennaya == true ? 1 : 0,            //Z.флВременнаяСхема КАК _Fld27973
                    _Fld28849: application.user.email,                                       //Z.ЭлектроннаяПочта КАК _Fld28849
                    _Fld31302: application.id_zayavka.toString(),                    //Z.ИДЗаявкиЛК КАК _Fld31302
                    _Fld36564RRef: "",                                             //Z.СтатусОплаты КАК _Fld36564RRef
                    //D_1C_Nomer: "",                                                //ЕстьNULL(D.НомерДоговораИтоговый, """") AS D_1C_Nomer
                    //D_1C_Status: "",                                               //D.СостояниеДоговораТП AS D_1C_Status
                    //D_1C_Data: (DateTime)orderTemp.v1C_DataDogovora,               //ЕстьNULL(D.ДатаДоговораИтоговая, ДАТАВРЕМЯ(1, 1, 1)) AS D_1C_Data
                    RegistraciyaTel: "",                                           //tRegistraciya.Телефон AS RegistraciyaTel
                    RegistraciyaEmail: "",                                         //tRegistraciya.ЭлектроннаяПочта AS RegistraciyaEmail
                    RegistraciyaPassword: "",                                      //tRegistraciya.Пароль AS RegistraciyaPassword
                    Filial: application.filial.caption_filial,                            //tFilial.Наименование AS Filial
                    VidZayavitel: application.user.id_usertype.id_usertype,                              //tVidZayavitel.Ссылка AS VidZayavitel
                    VidZayavka: application.id_zayavkatype.id_zayavkatype,                          //tVidZayavka.Ссылка AS VidZayavka
                    UrovenU: application.powerLevel.toString(),         //tUrovenU.Ссылка AS UrovenU
                    D_AKT_TP_COUNT: 0,                                             //ЕстьNULL(D_AKT_TP.Колво, 0) AS D_AKT_TP_COUNT
                    D_AKT_DopuskaPU_COUNT: 0,                                      //ЕстьNULL(D_AKT_DopuskaPU.Колво, 0) AS D_AKT_DopuskaPU_COUNT
                    INN: application.user.inn,
                    OperatorName: `${user.lastname} ${user.firstname} ${user.surname}`
                }
            ).toPromise();
        } catch (e) {
            console.log(e);
            return e
        } finally {
            this.application1cService.close();
        }
    }

    async rpcFillAppFiles(appNumber: string): Promise<any> {
        console.log('setting rpc header');
        const rpcCallHeader = {
            method: 'Query',
            backQueueName: this.generateGuid(),
            body: {
                rpcQuery: `Выбрать tDoc.Ссылка КАК _IDRRef, NULL КАК DogStatus, tDoc.ИмяФайла КАК _Fld24758, tDoc.ВидФайла.Наименование КАК _Description, 
                            ВидФайла.Код КАК VidDocCode, tDoc.ДатаЗаписи AS Z_DocDate, tDoc.Том.Путь КАК _Fld28469, tDoc.ПолныйПутьВТоме КАК _Fld28470, 
                            tDoc.ИмяФайлаВТоме КАК _Fld28471, tDoc.РасширениеФайлаВТоме КАК _Fld28472 
                            Из Справочник.удХранилище КАК tDoc 
                            Внутреннее Соединение Документ.удЗаявка КАК З 
                            По З.Ссылка = tDoc.Объект 
                                И З.НомерЗаявки = &AppNumber 
                            Левое Соединение Справочник.удВидыДокументовПриложенийКЗаявкам КАК tVidDoc 
                            По tDoc.ВидФайла = tVidDoc.Ссылка 
                            Где tDoc.ПометкаУдаления = Ложь И tVidDoc.ДоступенВЛК = Истина 
                            Упорядочить По tDoc.ДатаЗаписи Убыв`,
                rpcParams: {
                    AppNumber: appNumber,
                },
            },
        };
        console.log('rpc request');
        const response = await firstValueFrom(await this.clientRpc.send({ cmd: 'rpcCall' }, rpcCallHeader).toPromise());
        console.log(response);
        return this.parseResponse(response);
    }

    async rpcFillDogFiles(appNumber: string): Promise<any> {
        console.log('setting rpc header');
        const rpcCallHeader = {
            method: 'Query',
            backQueueName: this.generateGuid(),
            body: {
                rpcQuery: `Выбрать tDoc.Ссылка КАК _IDRRef, Д.СостояниеДоговораТП КАК DogStatus, tDoc.ИмяФайла КАК _Fld24758, tDoc.ВидФайла.Наименование КАК _Description, 
                            ВидФайла.Код КАК VidDocCode, tDoc.ДатаЗаписи AS Z_DocDate, tDoc.Том.Путь КАК _Fld28469, tDoc.ПолныйПутьВТоме КАК _Fld28470, 
                            tDoc.ИмяФайлаВТоме КАК _Fld28471, tDoc.РасширениеФайлаВТоме КАК _Fld28472 
                            Из Справочник.удХранилище КАК tDoc 
                            Внутреннее Соединение Документ.удДоговор КАК Д 
                            По Д.Ссылка = tDoc.Объект 
                            Внутреннее Соединение Документ.удЗаявка КАК З 
                            По Д.Ссылка = З.ДокументДоговор 
                                И З.НомерЗаявки = &Appnumber 
                            Левое Соединение Справочник.удВидыДокументовПриложенийКЗаявкам КАК tVidDoc 
                            По tDoc.ВидФайла = tVidDoc.Ссылка 
                            Где tDoc.ПометкаУдаления = Ложь И tVidDoc.ДоступенВЛК = Истина 
                            Упорядочить По tDoc.ДатаЗаписи Убыв`,
                rpcParams: {
                    AppNumber: appNumber,
                },
            },
        };
        console.log('rpc request');
        const response = await firstValueFrom(await this.clientRpc.send({ cmd: 'rpcCall' }, rpcCallHeader).toPromise());
        console.log(response);
        return this.parseResponse(response);
    }

    async rpcFillDogInfo(appNumber: string): Promise<any> {
        console.log('setting rpc header');
        const rpcCallHeader = {
            method: 'Query',
            backQueueName: this.generateGuid(),
            body: {
                rpcQuery: `Выбрать Д.Ссылка КАК _IDRRef, Д.НомерДоговораИтоговый КАК D_1C_Nomer, Д.СостояниеДоговораТП КАК D_1C_Status, Д.ДатаДоговораИтоговая КАК D_1C_Data 
                            Из Документ.удДоговор КАК Д
                            Внутреннее Соединение Документ.удЗаявка КАК З
                            По Д.Ссылка = З.ДокументДоговор И З.НомерЗаявки = &AppNumber`,
                rpcParams: {
                    AppNumber: appNumber,
                },
            },
        };
        console.log('rpc request');
        const response = await firstValueFrom(await this.clientRpc.send({ cmd: 'rpcCall' }, rpcCallHeader).toPromise());
        console.log(response);
        return this.parseResponse(response);
    }

    private generateGuid(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private parseResponse(response: any): any {
        console.log('parsing response');
        try {
            return JSON.parse(response);
        } catch (e) {
            console.error('Error parsing response:', e);
            return null;
        }
    }

    async saveApplicationFrom1C(applicationData: any): Promise<Applications> {
        try {
          // Поиск пользователя по email
        //   const user = await this.usersRepository.findOne({
        //     where: { email: applicationData._Fld28849 },
        //   });
        
        const user = await this.usersService.getUserByEmail(applicationData._Fld28849);

          if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
          }
    
          // Поиск типа заявки
          const applicationType = await this.applicationTypeRepository.findOne({
            where: { id_zayavkatype: applicationData.VidZayavka },
          });
    
          if (!applicationType) {
            throw new HttpException('Application type not found', HttpStatus.NOT_FOUND);
          }
    
          // Поиск филиала
        //   const filial = await this.filialsRepository.findOne({
        //     where: { caption_filial: applicationData.Filial },
        //   });
          
        const filial = await this.filialService.getFilialByCaption(applicationData.Filial);

          if (!filial) {
            throw new HttpException('Filial not found', HttpStatus.NOT_FOUND);
          }
    
          // Поиск статуса заявки
          const status = await this.zayavkaStatusReposytory.findOne({
            where: { id_zayavkastatus_1c: Buffer.from(applicationData._Fld26210RRef) },
          });
    
          if (!status) {
            throw new HttpException('Status not found', HttpStatus.NOT_FOUND);
          }
    
          // Поиск источника заявки
          const orderSource = await this.orderSourceRepository.findOne({
            where: { id_ordersource: applicationData.id_ordersource },
          });
    
          if (!orderSource) {
            throw new HttpException('Order source not found', HttpStatus.NOT_FOUND);
          }
    
          // Создание новой заявки
          const newApplication = new Applications();
          newApplication.id_zayavka = applicationData._Fld31302;
          newApplication.user = user;
          newApplication.id_zayavkatype = applicationType;
          newApplication.filial = filial;
          newApplication.applicationNumber = applicationData._Fld26403;
          newApplication.applicationDate = new Date();
          newApplication.status = status;
          newApplication.address = applicationData._Fld26201;
          newApplication.maxPower = applicationData._Fld26206;
          newApplication.powerLevel = Buffer.from(applicationData.UrovenU);
          newApplication.id_ordersource = orderSource;
          newApplication.is_vremennaya = applicationData._Fld27973 === 1;
          newApplication.v1c_statuszayavki = Buffer.from(applicationData._Fld26210RRef);
          newApplication.v1c_statusoplaty = Buffer.from(applicationData._Fld36564RRef);
          newApplication.v1c_nomerdogovora = applicationData.D_1C_Nomer;
          newApplication.v1c_datadogovora = applicationData.D_1C_Data;
          newApplication.v1c_statusdogovora = Buffer.from(applicationData.D_1C_Status);
          newApplication.v1c_epu = applicationData._Fld26200;
          newApplication.v1c_zayavitel = applicationData._Fld26191;
          newApplication.date_copy_from1c = new Date();
    
          // Сохранение заявки в БД
          return await this.applicationsReposytory.save(newApplication);
        } catch (e) {
          console.log(e);
          throw new HttpException('Error saving application', HttpStatus.INTERNAL_SERVER_ERROR);
        }
      }

    // async createFrom1C(applicationData: Applications) {
    //     const appliPaymentsOption = await this.vidRassrochkiReposytory.findOne({
    //         where: {
    //             enumorder: parseInt(applicationData.paymentsOption)
    //         }
    //     })

    //     const applicatyonType = await this.applicationTypeRepository.findOne({
    //         where: {
    //             id_zayavkatype: 0
    //         }
    //     })

    //     const appliAddress = applicationData.city + ', ' + applicationData.address;

    //     const appliEnumUrovenU = await this.enumUReposytory.findOne({
    //         where: {
    //             enumorder: parseInt(applicationData.powerLevel)
    //         }
    //     })

    //     const appliProvider = await this.gpRepository.findOne({
    //         where: {
    //             caption_gp: applicationData.provider
    //         }
    //     })

    //     const applicationReason = await this.prichinaPodachiRepository.findOne({
    //         where: {
    //             caption_short: applicationData.reason
    //         }
    //     })
        
    //     const newApplication = this.applicationsReposytory.create({
    //         id_zayavkatype: applicatyonType,
    //         uuid: uuidv4(),
    //         paymentsOption: appliPaymentsOption.idrref,
    //         address: appliAddress,
    //         powerLevel: appliEnumUrovenU.idrref,
    //         provider: appliProvider.id_gp,
    //         reason: applicationReason.id_prichinapodachiz,
    //         createdAt: new Date(),
    //         is_viewed: false,
    //         maxPower: parseFloat(applicationData.maxPower)
    //     });
    //     newApplication.user = user;
    //     await this.applicationsReposytory.save(newApplication);
    //     await this.documentsService.saveFiles(files, newApplication);

    //     // await this.chatService.createChat(newApplication);

    //     return newApplication;
    // }

    async setDogovorFiles(userData: Payload, files: DogovorFilesDto, applicationId: string) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }

        const application = await this.applicationsReposytory.findOne({
            where: {
                id_zayavka: applicationId
            }
        })

        return await this.documentsService.setDogovorFilesByApplication(application, files);
    }

    async getDogovorFiles(userData: Payload, applicationId: string) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);
        const application = await this.applicationsReposytory.findOne({
            relations: {
                user: true,
            },
            where: {
                id_zayavka: applicationId
            }
        });

        if (application.user.id_user !== user.id_user && user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
        }

        const files = await this.documentsService.getDogovorFilesByApplicationId(applicationId);

        return files.map((file) => {
            return new ContractFilesDto(file);
        })
    }

    async create(userDate: Payload, files: ApplicationFiles, applicationData: CreateApplication) {
        const user = await this.usersService.getUserByEmail(userDate.publickUserEmail);

        const appliPaymentsOption = await this.vidRassrochkiReposytory.findOne({
            where: {
                enumorder: parseInt(applicationData.paymentsOption)
            }
        })

        const applicatyonType = await this.applicationTypeRepository.findOne({
            where: {
                id_zayavkatype: 0
            }
        })

        const appliAddress = applicationData.city + ', ' + applicationData.address;

        const appliEnumUrovenU = await this.enumUReposytory.findOne({
            where: {
                enumorder: parseInt(applicationData.powerLevel)
            }
        })

        const appliProvider = await this.gpRepository.findOne({
            where: {
                caption_gp: applicationData.provider
            }
        })

        const applicationReason = await this.prichinaPodachiRepository.findOne({
            where: {
                caption_short: applicationData.reason
            }
        })

        const orderSource = await this.orderSourceRepository.findOne({
            where: {
                caption_ordersource_short: 'ЛК'
            }
        })

        const idZayavkastatus = await this.zayavkaStatusReposytory.findOne({
            where: {
                id_zayavkastatus: 1
            }
        })
        
        const newApplication = this.applicationsReposytory.create({
            id_zayavkatype: applicatyonType,
            id_zayavka: uuidv4(),
            paymentsOption: appliPaymentsOption.idrref,
            address: appliAddress,
            powerLevel: appliEnumUrovenU.idrref,
            provider: appliProvider.id_gp,
            reason: applicationReason.id_prichinapodachiz,
            createdAt: new Date(),
            is_viewed: false,
            id_ordersource: orderSource,
            maxPower: parseFloat(applicationData.maxPower),
            paymantStatus: null,
            status: idZayavkastatus,
            v1c_statusdogovora: null,
        });
        newApplication.user = user;
        await this.applicationsReposytory.save(newApplication);
        await this.documentsService.saveFiles(files, newApplication);

        // await this.chatService.createChat(newApplication);

        return newApplication;
    }

    async editApplication(userDate: Payload, applicationUuid: string, applicationData: CreateApplication) {
        const user = await this.usersService.getUserByEmail(userDate.publickUserEmail);

        const application = await this.applicationsReposytory.findOne({
            relations: {
                user: true
            },
            where: {
                id_zayavka: applicationUuid,
                user: {
                    id_user: user.id_user
                }
            }
        });

        // const appliStatus = await this.zayavkaStatusReposytory.findOne({
        //     where: {
        //         id_zayavkastatus: application.status
        //     }
        // })

        if (application.status !== null) {
            throw new HttpException('permission denied', HttpStatus.FORBIDDEN)
        }

        const appliPaymentsOption = await this.vidRassrochkiReposytory.findOne({
            where: {
                caption_long: applicationData.paymentsOption
            }
        })

        const appliAddress = applicationData.city + ', ' + applicationData.address;

        const appliEnumUrovenU = await this.enumUReposytory.findOne({
            where: {
                caption_long: applicationData.powerLevel
            }
        })

        const appliProvider = await this.gpRepository.findOne({
            where: {
                caption_gp: applicationData.provider
            }
        })

        const applicationReason = await this.prichinaPodachiRepository.findOne({
            where: {
                caption_short: applicationData.reason
            }
        })

        application.address = appliAddress;
        application.maxPower = parseFloat(applicationData.maxPower);
        application.paymentsOption = appliPaymentsOption.idrref;
        application.powerLevel = appliEnumUrovenU.idrref;
        application.provider = appliProvider.id_gp;
        application.reason = applicationReason.id_prichinapodachiz;

        await this.applicationsReposytory.save(application);

        const id1c_cenovayakategoriya = await this.cenKatReposytory.findOne({
            where: {
                idrref: application.id1c_cenovayakategoriya
            }
        })

        const id1c_vidzayavki = await this.vidZayavkiReposytory.findOne({
            where: {
                idrref: application.id1c_vidzayavki
            }
        })

        const v1c_statuszayavki = await this.zayavkaStatusReposytory.findOne({
            where: {
                id_zayavkastatus_1c: application.v1c_statuszayavki
            }
        })

        const statusDogovora = await this.documentsService.getContractStatusById1C(application.v1c_statusdogovora);

        let id1c_statusoplaty = await this.statusOplatyReposytory.findOne({
            where: {
                idrref: application.paymantStatus
            }
        })

        if (application.paymantStatus == null) {
            id1c_statusoplaty = null
        }

        return new ApplicationsResponse(application,
                                        appliEnumUrovenU.caption_long,
                                        id1c_cenovayakategoriya.caption_long,
                                        appliPaymentsOption.caption_long,
                                        id1c_vidzayavki.caption_long,
                                        id1c_statusoplaty,
                                        v1c_statuszayavki.caption_zayavkastatus,
                                        statusDogovora ? statusDogovora.caption_contractstatus : null,
                                        appliProvider.caption_gp,
                                        applicationReason.caption_long
        );
    }

    // async addApplicationFiles(userDate: Payload, applicationId: number, files: ApplicationFiles) {
    //     const user = await this.usersService.getUserByEmail(userDate.publickUserEmail);

    //     const application = await this.applicationsReposytory.findOne({
    //         relations: {
    //             user: true
    //         },
    //         where: {
    //             id: applicationId,
    //             user: {
    //                 id_user: user.id_user
    //             }
    //         }
    //     });

    //     if (application.status !== ApplicationStatus.accepted) {
    //         throw new HttpException('permission denied', HttpStatus.FORBIDDEN)
    //     }

    //     return await this.filesService.saveFiles(files, application);
    // }

    // async deleteApplicationFiles(userDate: Payload, applicationId: number, fileId: number) {
    //     const user = await this.usersService.getUserByEmail(userDate.publickUserEmail);

    //     const application = await this.applicationsReposytory.findOne({
    //         relations: {
    //             user: true
    //         },
    //         where: {
    //             id: applicationId,
    //             user: {
    //                 id_user: user.id_user
    //             }
    //         }
    //     });

    //     if (application.status !== ApplicationStatus.accepted) {
    //         throw new HttpException('permission denied', HttpStatus.FORBIDDEN)
    //     }

    //     return await this.filesService.deleteFilesById(fileId);
    // }

    async getApplicationsFiles(userData: Payload, applicationId: string) {
        const user = await this.usersService.getUserByEmail(userData.publickUserEmail);
        const application = await this.applicationsReposytory.findOne({
            relations: {
                user: true,
            },
            where: {
                id_zayavka: applicationId
            }
        });

        if (application.user.id_user !== user.id_user && user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
        }

        // await this.rpcFillAppFiles(applicationId);
        // await this.rpcFillDogFiles(applicationId);
        // await this.rpcFillDogInfo(applicationId);

        return await this.documentsService.getFilesByApplication(applicationId);
    }

    async setView(userData: Payload, applicationUuid: string) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }

        const application = await this.applicationsReposytory.findOne({
            where: {
                id_zayavka: applicationUuid,
            }
        });

        application.is_viewed = true;

        return await this.applicationsReposytory.save(application);
    }

    // async getApplicationsByUser(userData: Payload) {
    //     const applications = await this.applicationsReposytory.find({
    //         relations: {
    //             user: true,
    //             id_zayavkatype: true,
    //             filial: true,
    //             status: true,
    //             documents: true
    //         },
    //         where: {
    //             user: {
    //                 email: userData.publickUserEmail,
    //                 isActive: true
    //             }
    //         },
    //         order: {
    //             createdAt: 'DESC'
    //         },
    //     })

    //     return applications.map(async (application) => {
    //         const id1c_enumurovenu = await this.enumUReposytory.findOne({
    //             where: {
    //                 idrref: application.powerLevel
    //             }
    //         })

    //         const id1c_cenovayakategoriya = await this.cenKatReposytory.findOne({
    //             where: {
    //                 idrref: application.id1c_cenovayakategoriya
    //             }
    //         })

    //         const id1c_vidrassrochki = await this.vidRassrochkiReposytory.findOne({
    //             where: {
    //                 idrref: application.paymentsOption
    //             }
    //         })

    //         const id1c_vidzayavki = await this.vidZayavkiReposytory.findOne({
    //             where: {
    //                 idrref: application.id1c_vidzayavki
    //             }
    //         })

    //         const id1c_statusoplaty = await this.statusOplatyReposytory.findOne({
    //             where: {
    //                 idrref: application.paymantStatus
    //             }
    //         })

    //         const v1c_statuszayavki = await this.zayavkaStatusReposytory.findOne({
    //             where: {
    //                 id_zayavkastatus_1c: application.v1c_statuszayavki
    //             }
    //         })

    //         const appliProvider = await this.gpRepository.findOne({
    //             where: {
    //                 id_gp: application.provider
    //             }
    //         })

    //         const appliPrichinapodachi = await this.prichinaPodachiRepository.findOne({
    //             where: {
    //                 id_prichinapodachiz: application.reason
    //             }
    //         })

    //         return new ApplicationsResponse(application,
    //                                         id1c_enumurovenu.caption_long,
    //                                         id1c_cenovayakategoriya.caption_long,
    //                                         id1c_vidrassrochki.caption_long,
    //                                         id1c_vidzayavki.caption_long,
    //                                         id1c_statusoplaty.caption_long,
    //                                         v1c_statuszayavki.caption_zayavkastatus,
    //                                         appliProvider.caption_gp,
    //                                         appliPrichinapodachi.caption_long);
    //     })
    // }

    async getApplicationsByUser(userData: Payload) {
        const applications = await this.applicationsReposytory.find({
            relations: {
                user: true,
                id_zayavkatype: true,
                filial: true,
                status: true,
                documents: true
            },
            where: {
                user: {
                    email: userData.publickUserEmail,
                    isActive: true
                }
            },
            order: {
                createdAt: 'DESC'
            },
        });
    
        const applicationResponses = await Promise.all(applications.map(async (application) => {
            const id1c_enumurovenu = await this.enumUReposytory.findOne({
                where: {
                    idrref: application.powerLevel
                }
            });
    
            const id1c_cenovayakategoriya = await this.cenKatReposytory.findOne({
                where: {
                    idrref: application.id1c_cenovayakategoriya
                }
            });
    
            const id1c_vidrassrochki = await this.vidRassrochkiReposytory.findOne({
                where: {
                    idrref: application.paymentsOption
                }
            });
    
            const id1c_vidzayavki = await this.vidZayavkiReposytory.findOne({
                where: {
                    idrref: application.id1c_vidzayavki
                }
            });
    
            let id1c_statusoplaty = await this.statusOplatyReposytory.findOne({
                where: {
                    idrref: application.paymantStatus
                }
            });

            if (application.paymantStatus == null) {
                id1c_statusoplaty = null
            } 
    
            const v1c_statuszayavki = await this.zayavkaStatusReposytory.findOne({
                where: {
                    id_zayavkastatus_1c: application.v1c_statuszayavki
                }
            });
    
            const appliProvider = await this.gpRepository.findOne({
                where: {
                    id_gp: application.provider
                }
            });
    
            const appliPrichinapodachi = await this.prichinaPodachiRepository.findOne({
                where: {
                    id_prichinapodachiz: application.reason
                }
            });

            const statusDogovora = await this.documentsService.getContractStatusById1C(application.v1c_statusdogovora);
    
            return new ApplicationsResponse(
                application,
                id1c_enumurovenu.caption_long,
                id1c_cenovayakategoriya.caption_long,
                id1c_vidrassrochki.caption_long,
                id1c_vidzayavki.caption_long,
                id1c_statusoplaty,
                v1c_statuszayavki.caption_zayavkastatus,
                statusDogovora ? statusDogovora.caption_contractstatus : null,
                appliProvider.caption_gp,
                appliPrichinapodachi.caption_long
            );
        }));
    
        return applicationResponses;
    }

    async getAllVidrassrochki(userData: Payload) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }

        const vidrassrochki = await this.vidRassrochkiReposytory.find();

        return vidrassrochki.map((object) => {
            return new VidRassrochkiDto(object);
        });
    }

    async getAllApplications(userData: Payload, pageNumber: number, filters: any) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }
    
        const skip = (pageNumber - 1) * 20;
        const take = 20;
    
        const queryBuilder = this.applicationsReposytory.createQueryBuilder('application')
        .leftJoinAndSelect('application.user', 'user')
        .leftJoinAndSelect('application.filial', 'filial')
        .leftJoinAndSelect('application.status', 'status')
        // .leftJoinAndSelect('application.paymentsOption', 'vidrassrochki')
        .orderBy('application.createdAt', 'DESC')
        .skip(skip)
        .take(take);

    if (filters.address) {
        queryBuilder.andWhere('application.v1c_adresepu LIKE :address', { address: `%${filters.address}%` });
    }
    if (filters.user) {
        queryBuilder.andWhere(
            '(user.lastname LIKE :user OR ' +
            'user.firstname LIKE :user OR ' +
            'user.surname LIKE :user OR ' +
            'user.yl_fullname LIKE :user OR ' +
            'user.yl_shortname LIKE :user)',
            { user: `%${filters.user}%` }
        );
    }
    if (filters.filial) {
        queryBuilder.andWhere('filial.caption_filial LIKE :caption_filial', { caption_filial: `%${filters.filial}%` });
    }
    if (filters.number) {
        queryBuilder.andWhere('application.applicationNumber LIKE :number', { number: `%${filters.number}%` });
    }
    if (filters.statusoplaty) {
        const statusoplaty = await this.statusOplatyReposytory.findOne({
            where: {
                enumorder: filters.statusoplaty
            }
        });

        console.log(statusoplaty);

        const statusString = statusoplaty.idrref.toString('hex');
        console.log(statusString);

        queryBuilder.andWhere(`encode(application.paymantStatus, 'hex') LIKE :status`, { status: `%${statusString}%` });
    }
    if (filters.contractstatus) {
        const contractstatus = await this.documentsService.getContractStatusById(filters.contractstatus);
        const statusString = contractstatus.id_contractstatus_1c.toString('hex');

        queryBuilder.andWhere(`encode(application.v1c_statusdogovora, 'hex') LIKE :status`, { status: `%${statusString}%` });
    }
    if (filters.vidrassrochki) {
        const vidrassrochki = await this.vidRassrochkiReposytory.findOne({
            where: {
                enumorder: filters.vidrassrochki
            }
        })
        // console.log(vidrassrochki);
        queryBuilder.andWhere('application.paymentsOption LIKE :vidrassrochki', { vidrassrochki: `%${vidrassrochki.idrref}%` });
    }
    if (filters.applicationstatus) {
        queryBuilder.andWhere('application.status.id_zayavkastatus = :applicationstatus', { applicationstatus: filters.applicationstatus });
    }

    const applications = await queryBuilder.getMany();
    // console.log(applications);
    
        return Promise.all(applications.map(async (application) => {

            console.log(application.v1c_statusdogovora);
            const id1c_enumurovenu = await this.enumUReposytory.findOne({
                where: {
                    idrref: application.powerLevel
                }
            });
    
            const id1c_cenovayakategoriya = await this.cenKatReposytory.findOne({
                where: {
                    idrref: application.id1c_cenovayakategoriya
                }
            });
    
            const id1c_vidrassrochki = await this.vidRassrochkiReposytory.findOne({
                where: {
                    idrref: application.paymentsOption
                }
            });
    
            const id1c_vidzayavki = await this.vidZayavkiReposytory.findOne({
                where: {
                    idrref: application.id1c_vidzayavki
                }
            });
    
            let id1c_statusoplaty = await this.statusOplatyReposytory.findOne({
                where: {
                    idrref: application.paymantStatus
                }
            });

            if (application.paymantStatus == null) {
                id1c_statusoplaty = null
            } 
    
            const v1c_statuszayavki = await this.zayavkaStatusReposytory.findOne({
                where: {
                    id_zayavkastatus_1c: application.v1c_statuszayavki
                }
            });

            // console.log(application.v1c_statusdogovora);
            const statusDogovora = await this.documentsService.getContractStatusById1C(application.v1c_statusdogovora);
    
            const appliProvider = await this.gpRepository.findOne({
                where: {
                    id_gp: application.provider
                }
            });
    
            const appliPrichinapodachi = await this.prichinaPodachiRepository.findOne({
                where: {
                    id_prichinapodachiz: application.reason
                }
            });
    
            return new ApplicationsResponse(
                application,
                id1c_enumurovenu.caption_long,
                id1c_cenovayakategoriya.caption_long,
                id1c_vidrassrochki.caption_long,
                id1c_vidzayavki.caption_long,
                id1c_statusoplaty,
                v1c_statuszayavki.caption_zayavkastatus,
                statusDogovora ? statusDogovora.caption_contractstatus : null,
                appliProvider.caption_gp,
                appliPrichinapodachi.caption_long
            );
        }));
    }

    public async getAllContractStatuses() {
        return await this.documentsService.getAllContractStatus();
    }

    public async get1CFile(fileinfo: { Volume: string; PathInVol: string }): Promise<string> {
        if (!fileinfo.Volume || !fileinfo.PathInVol) {
          return '';
        }
    
        try {
          const rpcCallHeader: RpcCallHeader = {
            Method: 'Get1CFile',
            BackQueueName: '', // Не требуется для Nest.js RMQ
            Body: {
              RpcParams: {
                Volume: fileinfo.Volume,
                PathInVol: fileinfo.PathInVol,
              },
            },
          };
    
          // Отправляем запрос через RabbitMQ
          const response = await this.clientRpc.send('get_1c_file', rpcCallHeader).toPromise();
    
          if (response && response.data) {
            const fileBuffer = Buffer.from(response.data, 'base64');
    
            if (fileBuffer.length > 0) {
              // Сохраняем файл во временную директорию
              const tempFilePath = path.join(
                path.resolve('./tmp'),
                `${Date.now()}_${Math.random().toString(36).substring(2)}.tmp`,
              );
              await fs.promises.writeFile(tempFilePath, fileBuffer);
              return tempFilePath;
            }
          }
    
          return ''; // Файл не найден
        } catch (error) {
          console.error('Ошибка при получении файла:', error);
          return '';
        }
      }
    

    async getAllApplicationStatus(userData: Payload) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }

        const statuses = await this.zayavkaStatusReposytory.find();

        return statuses.map((status) => {
            return new ApplicationStatusResponse(status);
        })
    }

    async getApplicationsCount(userData: Payload) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }

        const applications = await this.applicationsReposytory.find();

        return applications.length;
    }

    async getDogovorEnergoCount(userData: Payload) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);
    
        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('Permission denied', HttpStatus.FORBIDDEN);
        }

        return await this.documentsService.getDogovorEnergoCount();
    }

    async getApplicationById(id: string) {
        return await this.applicationsReposytory.findOne({
            where: {
                id_zayavka: id
            }
        })
    }

    async getApplicationByIdForClient(userData: Payload, applicationUuid: string) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);

        const application = await this.applicationsReposytory.findOne({
            relations: {
                user: true,
                filial: true
            },
            where: {
                id_zayavka: applicationUuid
            }
        })

        if (user.id_userrole.caption_userrole !== Role.Admin && user.id_user !== application.user.id_user) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        const id1c_enumurovenu = await this.enumUReposytory.findOne({
            where: {
                idrref: application.powerLevel
            }
        })

        const id1c_cenovayakategoriya = await this.cenKatReposytory.findOne({
            where: {
                idrref: application.id1c_cenovayakategoriya
            }
        })

        const id1c_vidrassrochki = await this.vidRassrochkiReposytory.findOne({
            where: {
                idrref: application.paymentsOption
            }
        })

        const id1c_vidzayavki = await this.vidZayavkiReposytory.findOne({
            where: {
                idrref: application.id1c_vidzayavki
            }
        })

        let id1c_statusoplaty = await this.statusOplatyReposytory.findOne({
            where: {
                idrref: application.paymantStatus
            }
        })

        if (application.paymantStatus == null) {
            id1c_statusoplaty = null
        }

        const v1c_statuszayavki = await this.zayavkaStatusReposytory.findOne({
            where: {
                id_zayavkastatus_1c: application.v1c_statuszayavki
            }
        })

        const appliProvider = await this.gpRepository.findOne({
            where: {
                id_gp: application.provider
            }
        })

        const appliPrichinapodachi = await this.prichinaPodachiRepository.findOne({
            where: {
                id_prichinapodachiz: application.reason
            }
        })

        const statusDogovora = await this.documentsService.getContractStatusById1C(application.v1c_statusdogovora);

        // console.log(new ApplicationsResponse(application,
        //     id1c_enumurovenu.caption_long,
        //     id1c_cenovayakategoriya.caption_long,
        //     id1c_vidrassrochki.caption_long,
        //     id1c_vidzayavki.caption_long,
        //     id1c_statusoplaty.caption_long,
        //     v1c_statuszayavki.caption_zayavkastatus,
        //     appliProvider.caption_gp,
        //     appliPrichinapodachi.caption_long))

        return new ApplicationsResponse(
            application,
            id1c_enumurovenu.caption_long,
            id1c_cenovayakategoriya.caption_long,
            id1c_vidrassrochki.caption_long,
            id1c_vidzayavki.caption_long,
            id1c_statusoplaty,
            v1c_statuszayavki.caption_zayavkastatus,
            statusDogovora ? statusDogovora.caption_contractstatus : null,
            appliProvider.caption_gp,
            appliPrichinapodachi.caption_long
        );
    }

    async getAllStatusOplaty(userData: Payload) {
        const user = await this.usersService.getUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        const statuses = await this.statusOplatyReposytory.find();

        return statuses.map((status) => {
            return new StatusOplatyResponse(status);
        })
    }

    async getFilialsForApplication(userData: Payload) {
        const user = await this.usersService.getUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        console.log(await this.filialService.getAllFilials());

        return await this.filialService.getAllFilials()
    }

    async setFilial(userData: Payload, data: SetApplicationFilial, applicationId: string) {
        const user = await this.usersService.getUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        console.log(data);

        const application = await this.applicationsReposytory.findOne({
            where: {
                id_zayavka: applicationId
            }
        });

        const filial = await this.filialService.getFilialById(data.filialId);
        console.log(filial);

        application.filial = filial;

        return await this.applicationsReposytory.save(application);
    }

    async getApplicationsStatuses(userData: Payload) {
        const user = await this.usersService.getUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        return await this.zayavkaStatusReposytory.find();
    }

    async setNumberStatus(userData: Payload, data: SetApplicationNumberStatus, applicationId: string) {
        const user = await this.usersService.getUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        console.log(data);

        const application = await this.applicationsReposytory.findOne({
            where: {
                id_zayavka: applicationId
            }
        });

        if (data?.number) {
            application.applicationNumber = data.number;
        };

        if (data?.date) {
            application.applicationDate = data.date;
        }

        if (data?.status) {
            const v1c_statuszayavki = await this.zayavkaStatusReposytory.findOne({
                where: {
                    id_zayavkastatus: data.status
                }
            })

            application.v1c_statuszayavki = v1c_statuszayavki.id_zayavkastatus_1c;
        };

        return await this.applicationsReposytory.save(application);
    }

    async getApplicationWorkingDocs(userData: Payload, applicationUuid: string) {
        const user = await this.usersService.getUserByEmail(userData.publickUserEmail);
        const application = await this.applicationsReposytory.findOne({
            relations: {
                user: true
            },
            where: {
                id_zayavka: applicationUuid
            }
        })

        if (!application) {
            return new HttpException('Not found', HttpStatus.NOT_FOUND);
        }

        if (user.id_userrole.caption_userrole !== Role.Admin && user.id_user !== application.user.id_user) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        return await this.documentsService.getInWorkFiles(applicationUuid);
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