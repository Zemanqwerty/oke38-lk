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

        @Inject('APPLICAITIONS_TO_1C_SERVICE') private application1cService: ClientProxy
    ) {};

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
                    uuid: applicationUUID
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
                    _Fld31302: application.uuid.toString(),                    //Z.ИДЗаявкиЛК КАК _Fld31302
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
        
        const newApplication = this.applicationsReposytory.create({
            id_zayavkatype: applicatyonType,
            uuid: uuidv4(),
            paymentsOption: appliPaymentsOption.idrref,
            address: appliAddress,
            powerLevel: appliEnumUrovenU.idrref,
            provider: appliProvider.id_gp,
            reason: applicationReason.id_prichinapodachiz,
            createdAt: new Date(),
            is_viewed: false,
            id_ordersource: orderSource,
            maxPower: parseFloat(applicationData.maxPower)
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
                uuid: applicationUuid,
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

        const id1c_statusoplaty = await this.statusOplatyReposytory.findOne({
            where: {
                idrref: application.paymantStatus
            }
        })

        return new ApplicationsResponse(application,
                                        appliEnumUrovenU.caption_long,
                                        id1c_cenovayakategoriya.caption_long,
                                        appliPaymentsOption.caption_long,
                                        id1c_vidzayavki.caption_long,
                                        id1c_statusoplaty.caption_long,
                                        v1c_statuszayavki.caption_zayavkastatus,
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
                uuid: applicationId
            }
        });

        if (application.user.id_user !== user.id_user && user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
        }

        return await this.documentsService.getFilesByApplication(applicationId);
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
            const [
                id1c_enumurovenu,
                id1c_cenovayakategoriya,
                id1c_vidrassrochki,
                id1c_vidzayavki,
                id1c_statusoplaty,
                v1c_statuszayavki,
                appliProvider,
                appliPrichinapodachi
            ] = await Promise.all([
                this.enumUReposytory.findOne({ where: { idrref: application.powerLevel } }),
                this.cenKatReposytory.findOne({ where: { idrref: application.id1c_cenovayakategoriya } }),
                this.vidRassrochkiReposytory.findOne({ where: { idrref: application.paymentsOption } }),
                this.vidZayavkiReposytory.findOne({ where: { idrref: application.id1c_vidzayavki } }),
                this.statusOplatyReposytory.findOne({ where: { idrref: application.paymantStatus } }),
                this.zayavkaStatusReposytory.findOne({ where: { id_zayavkastatus_1c: application.v1c_statuszayavki } }),
                this.gpRepository.findOne({ where: { id_gp: application.provider } }),
                this.prichinaPodachiRepository.findOne({ where: { id_prichinapodachiz: application.reason } })
            ]);
    
            return new ApplicationsResponse(
                application,
                id1c_enumurovenu?.caption_long,
                id1c_cenovayakategoriya?.caption_long,
                id1c_vidrassrochki?.caption_long,
                id1c_vidzayavki?.caption_long,
                id1c_statusoplaty?.caption_long,
                v1c_statuszayavki?.caption_zayavkastatus,
                appliProvider?.caption_gp,
                appliPrichinapodachi?.caption_long
            );
        }));
    
        return applicationResponses;
    }

    async getAllApplications(userData: Payload, pageNumber: number) {
        const user = await this.usersService.getActivatedUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        const skip = (pageNumber - 1) * 20;
        const take = 20;

        const applications = await this.applicationsReposytory.find({
            relations: {
                user: true,
                filial: true
            },
            order: { createdAt: 'DESC' },
            skip,
            take
        })

        console.log(applications);

        return Promise.all(applications.map(async (application) => {
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

            const id1c_statusoplaty = await this.statusOplatyReposytory.findOne({
                where: {
                    idrref: application.paymantStatus
                }
            })

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

            console.log(new ApplicationsResponse(application,
                id1c_enumurovenu.caption_long,
                id1c_cenovayakategoriya.caption_long,
                id1c_vidrassrochki.caption_long,
                id1c_vidzayavki.caption_long,
                id1c_statusoplaty.caption_long,
                v1c_statuszayavki.caption_zayavkastatus,
                appliProvider.caption_gp,
                appliPrichinapodachi.caption_long))

            return new ApplicationsResponse(application,
                                            id1c_enumurovenu.caption_long,
                                            id1c_cenovayakategoriya.caption_long,
                                            id1c_vidrassrochki.caption_long,
                                            id1c_vidzayavki.caption_long,
                                            id1c_statusoplaty.caption_long,
                                            v1c_statuszayavki.caption_zayavkastatus,
                                            appliProvider.caption_gp,
                                            appliPrichinapodachi.caption_long);
        }));
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
                uuid: applicationId
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
                uuid: applicationId
            }
        });

        if (data?.number) {
            application.applicationNumber = data.number;
        };

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

    async getApplicationById(applicationUuid: string) {
        return await this.applicationsReposytory.findOne({
            where: {
                uuid: applicationUuid
            }
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