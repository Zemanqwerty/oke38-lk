import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
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

        @InjectRepository(Files)
        private filesRepository: Repository<Files>,
        
        @InjectRepository(Gp)
        private gpRepository: Repository<Gp>,

        @InjectRepository(PrichinaPodachi)
        private prichinaPodachiRepository: Repository<PrichinaPodachi>,

        private usersService: UsersService,
        private filesService: FilesService,
        private chatService: ChatService,
    ) {};

    async create(userDate: Payload, files: ApplicationFiles, applicationData: CreateApplication) {
        const user = await this.usersService.getUserByEmail(userDate.publickUserEmail);

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
        
        const newApplication = this.applicationsReposytory.create({
            paymentsOption: appliPaymentsOption.idrref,
            address: appliAddress,
            powerLevel: appliEnumUrovenU.idrref,
            provider: appliProvider.id_gp,
            reason: applicationReason.id_prichinapodachiz,
            maxPower: parseFloat(applicationData.maxPower)
        });
        newApplication.user = user;
        await this.applicationsReposytory.save(newApplication);
        await this.filesService.saveFiles(files, newApplication);

        await this.chatService.createChat(newApplication);

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

    // async getApplicationsFiles(userData: Payload, applicationId: number) {
    //     const user = await this.usersService.getUserByEmail(userData.publickUserEmail);
    //     const application = await this.applicationsReposytory.findOne({
    //         relations: {
    //             user: true
    //         },
    //         where: {
    //             id: applicationId
    //         }
    //     });

    //     if (application.user.id_user !== user.id_user && user.id_userrole.caption_userrole !== Role.Admin) {
    //         throw new HttpException('permission denied', HttpStatus.FORBIDDEN);
    //     }

    //     return await this.filesService.getFilesByApplication(applicationId);
    // }

    async getApplicationsByUser(userData: Payload) {
        const applications = await this.applicationsReposytory.find({
            relations: {
                user: true
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
        })

        return applications.map(async (application) => {
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

            return new ApplicationsResponse(application,
                                            id1c_enumurovenu.caption_long,
                                            id1c_cenovayakategoriya.caption_long,
                                            id1c_vidrassrochki.caption_long,
                                            id1c_vidzayavki.caption_long,
                                            id1c_statusoplaty.caption_long,
                                            v1c_statuszayavki.caption_zayavkastatus,
                                            appliProvider.caption_gp,
                                            appliPrichinapodachi.caption_long);
        })
    }

    async getAllApplications(userData: Payload, pageNumber: number) {
        const user = await this.usersService.getUserByEmail(userData.publickUserEmail);

        if (user.id_userrole.caption_userrole !== Role.Admin) {
            throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        };

        const skip = (pageNumber - 1) * 20;
        const take = 20;

        const applications = await this.applicationsReposytory.find({
            relations: {
                user: true
            },
            order: { createdAt: 'DESC' },
            skip,
            take
        })

        return applications.map(async (application) => {
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

            return new ApplicationsResponse(application,
                                            id1c_enumurovenu.caption_long,
                                            id1c_cenovayakategoriya.caption_long,
                                            id1c_vidrassrochki.caption_long,
                                            id1c_vidzayavki.caption_long,
                                            id1c_statusoplaty.caption_long,
                                            v1c_statuszayavki.caption_zayavkastatus,
                                            appliProvider.caption_gp,
                                            appliPrichinapodachi.caption_long);
        })
    }

    // async setFilial(userData: Payload, data: SetApplicationFilial, applicationId: number) {
    //     const user = await this.usersService.getUserByEmail(userData.publickUserEmail);

    //     if (user.id_userrole.caption_userrole !== Role.Admin) {
    //         throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
    //     };

    //     const application = await this.applicationsReposytory.findOne({
    //         where: {
    //             id: applicationId
    //         }
    //     });

    //     application.filial = data.filial;

    //     return await this.applicationsReposytory.save(application);
    // }

    // async setNumberStatus(userData: Payload, data: SetApplicationNumberStatus, applicationId: number) {
    //     const user = await this.usersService.getUserByEmail(userData.publickUserEmail);

    //     if (user.id_userrole.caption_userrole !== Role.Admin) {
    //         throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
    //     };

    //     console.log(data);

    //     const application = await this.applicationsReposytory.findOne({
    //         where: {
    //             id: applicationId
    //         }
    //     });

    //     if (data?.number) {
    //         application.applicationNumber = data.number;
    //     };

    //     if (data?.status) {
    //         application.status = data.status;
    //     };

    //     return await this.applicationsReposytory.save(application);
    // }

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