import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Documents } from './documents.entity';
import { Repository } from 'typeorm';
import { Doctype } from './doctype.entity';
import { ApplicationFiles } from 'src/dtos/applications/ApplicationFiles.dto';
import { Applications } from 'src/applications/applications.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentsService {
    constructor(
        @InjectRepository(Documents)
        private docsRepositiry: Repository<Documents>,
        @InjectRepository(Doctype)
        private doctypeRepository: Repository<Doctype>,
        
    ) {};

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
                    uuid: uuid
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
