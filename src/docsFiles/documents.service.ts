import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Documents } from './documents.entity';
import { Repository } from 'typeorm';
import { Doctype } from './doctype.entity';
import { ApplicationFiles } from 'src/dtos/applications/ApplicationFiles.dto';
import { Applications } from '../applications/applications.entity';
import { v4 as uuidv4 } from 'uuid';
import { DogovorEnergo } from './dogovorenergo.entity';
import { EditDogovorEnergoData } from 'src/dtos/applications/SetDogovorEnergo.dto';
import { Contract } from './contract.entity';
import { DogovorFilesDto } from 'src/dtos/applications/DogovorFiles.dto';
import { ContractDoc } from './contractdoc.entity';
import { ContractSatatus } from './contractstatus.entity';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Documents)
        private docsRepositiry: Repository<Documents>,
        @InjectRepository(Doctype)
        private doctypeRepository: Repository<Doctype>,
        @InjectRepository(DogovorEnergo)
        private dogovorenergoRepository: Repository<DogovorEnergo>,
        @InjectRepository(Contract)
        private contractRepository: Repository<Contract>,
        @InjectRepository(ContractDoc)
        private contractDocRepository: Repository<ContractDoc>,
        @InjectRepository(ContractSatatus)
        private contractStatusRepository: Repository<ContractSatatus>,
    ) {};

    async getInWorkFiles(applicationUuid: string) {
        return await this.docsRepositiry.find({
            relations: {
                application: true,
                doctype: true
            },
            where: {
                application: {
                    id_zayavka: applicationUuid
                },
                doctype: {
                    id_doctype: 1
                }
            }
        })
    }

    async getAllDogovorenergo(pageNumber: number) {
        const skip = (pageNumber - 1) * 20;
        const take = 20;

        return await this.dogovorenergoRepository.find({
            relations: {
                id_zayavka: {user: true, status: true}
            },
            order: {
                id_dogovorenergo: 'DESC'
            },
            skip,
            take
        });
    }

    async setDogovorFilesByApplication(application: Applications, files: DogovorFilesDto) {
        const contract = await this.getContractDataByApplication(application);
        const doctypeDogovor = await this.doctypeRepository.findOne({where: {id_doctype: 4}});
        const doctypePayment = await this.doctypeRepository.findOne({where: {id_doctype: 11}});

        if (files.dogovorFile) {
            const dogovorFile = this.contractDocRepository.create({
                id_contractdoc: uuidv4(),
                id_contract: contract,
                id_doctype: doctypeDogovor,
                doc_file_name: files.dogovorFile[0].originalname,
                date_doc_add: new Date(),
                doc_file_path: files.dogovorFile[0].path
            });

            return await this.contractDocRepository.save(dogovorFile);
        }

        if (files.paymentFile) {
            const paymentFile = this.contractDocRepository.create({
                id_contractdoc: uuidv4(),
                id_contract: contract,
                id_doctype: doctypePayment,
                doc_file_name: files.paymentFile[0].originalname,
                date_doc_add: new Date(),
                doc_file_path: files.paymentFile[0].path
            });

            return await this.contractDocRepository.save(paymentFile);
        }
    }

    async getDogovorFilesByApplicationId(applicationId: string) {
        return await this.contractDocRepository
            .createQueryBuilder('contractDoc')
            // Присоединяем связь с таблицей Contract (id_contract)
            .leftJoinAndSelect('contractDoc.id_contract', 'contract')
            // Присоединяем связь с таблицей Applications через Contract (id_zayavka)
            .leftJoinAndSelect('contract.id_zayavka', 'application')
            // Присоединяем связь с таблицей Doctype (id_doctype)
            .leftJoinAndSelect('contractDoc.id_doctype', 'doctype')
            // Добавляем условие для фильтрации по applicationId
            .where('application.id_zayavka = :applicationId', { applicationId })
            // Выполняем запрос и получаем результат
            .getMany();
    }

    async getContractDataByApplication(application: Applications) {
        const contract = await this.contractRepository.createQueryBuilder('contract')
        .leftJoinAndSelect('contract.id_zayavka', 'application') // Загружаем связанную заявку
        .leftJoinAndSelect('contract.id_contractstatus', 'contractstatus') // Загружаем тип пользователя, если нужно
        .where('application.id_zayavka = :applicationId', { applicationId: application.id_zayavka }) // Используем applicationId как параметр
        .getOne();

        const contractStatus = await this.contractStatusRepository.findOne({
            where: {
                id_contractstatus: 1
            }
        })

        if (!contract) {
            const newContract = this.contractRepository.create({
                id_contractdoc: uuidv4(),
                id_zayavka: application,
                id_contractstatus: contractStatus,
                contract_number_1c: '',
                contract_date_1c: new Date()
            })

            return await this.contractRepository.save(newContract);
        }

        return contract
    }

    async createNewDogovorEnergo(dogovorData: EditDogovorEnergoData, application: Applications) {
        const dogovor = this.dogovorenergoRepository.create({
            id_dogovorenergo: uuidv4(),
            date_create_de: dogovorData.dateOfCreateDogovor ? dogovorData.dateOfCreateDogovor : null,
            id_zayavka: application,
            nomer_dogovorenergo: dogovorData.dogovorNumber ? dogovorData.dogovorNumber : null,
            nomer_elektroustanovka: dogovorData.epuNumber ? dogovorData.epuNumber : null,
            nomer_ls: dogovorData.nomerLS ? dogovorData.nomerLS : null
        })

        await this.dogovorenergoRepository.save(dogovor);
    }

    async setDogovorEnergoData(dogovorData: EditDogovorEnergoData, application: Applications) {
        // const dogovor = this.dogovorenergoRepository.create({
        //     id_dogovorenergo: uuidv4(),
        //     date_create_de: dogovorData.dateOfCreateDogovor ? dogovorData.dateOfCreateDogovor : null,
        //     id_zayavka: application,
        //     nomer_dogovorenergo: dogovorData.dogovorNumber ? dogovorData.dogovorNumber : null,
        //     nomer_elektroustanovka: dogovorData.epuNumber ? dogovorData.epuNumber : null,
        //     nomer_ls: dogovorData.nomerLS ? dogovorData.nomerLS : null
        // })

        const dogovor = await this.getDogovorEnergoByApplicationId(application.id_zayavka);
        dogovor.date_create_de = dogovorData.dateOfCreateDogovor ? dogovorData.dateOfCreateDogovor : null
        dogovor.nomer_dogovorenergo = dogovorData.dogovorNumber ? dogovorData.dogovorNumber : null
        dogovor.nomer_elektroustanovka = dogovorData.epuNumber ? dogovorData.epuNumber : null
        dogovor.nomer_ls = dogovorData.nomerLS ? dogovorData.nomerLS : null

        await this.dogovorenergoRepository.save(dogovor);
    }

    async getDogovorEnergoByApplicationId(id: string) {
        return await this.dogovorenergoRepository.createQueryBuilder('dogovor')
            .leftJoinAndSelect('dogovor.id_zayavka', 'application') // Загружаем связанную заявку
            .leftJoinAndSelect('application.user', 'user') // Загружаем связанного пользователя
            .leftJoinAndSelect('user.id_usertype', 'usertype') // Загружаем тип пользователя, если нужно
            .where('application.id_zayavka = :id', { id })
            .getOne();
    }

    async getFileType(fileTypeCaption: string) {
        console.log(fileTypeCaption);
        return await this.doctypeRepository.findOne({
            where: {
                id_doctype: parseInt(fileTypeCaption)
            }
        })
    }

    async saveFiles(files: ApplicationFiles, application: Applications) {
        for (const group in files) {
            const fileType: Doctype = await this.getFileType(group)
            console.log('---');
            console.log(fileType);
            console.log('---');
            for (const file of files[group]) {
                const newFile = new Documents();
                newFile.id_zayavkadoc = uuidv4();
                newFile.doctype = fileType;
                newFile.doc_file_name = file.originalname;
                newFile.doc_file_path = file.path;
                newFile.date_doc_add = new Date();
                newFile.application = application;

                await this.docsRepositiry.save(newFile);
            }
        }
    }

    async getFilesByApplication(uuid: string) {
        return await this.docsRepositiry.find({
            relations: {
                application: true,
                doctype: true
            },
            where: {
                application: {
                    id_zayavka: uuid
                }
            }
        })
    }

    async deleteFilesById(fileId: string) {
        const file = await this.docsRepositiry.findOne({
            where: {
                id_zayavkadoc: fileId
            }
        });

        return await this.docsRepositiry.remove(file);
    }
}
