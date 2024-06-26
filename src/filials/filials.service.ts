import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Filials } from "./filials.entity";
import { Repository } from "typeorm";

@Injectable()
export class FilialService {
    constructor(
        @InjectRepository(Filials)
        private filialsRepository: Repository<Filials>,
    ) {};

    async getFilialByCaption(caption: string) {
        return await this.filialsRepository.findOne({
            where: {
                caption_filial: caption
            }
        })
    }

    async onModuleInit() {
        const baseFilialCondidate = await this.filialsRepository.find();

        if (baseFilialCondidate.length !== 0) {
            return
        }

        const baseFilial = this.filialsRepository.create({
            caption_filial: ' ',
            caption_filial_short: ' '
        })

        console.log('CREATING BASE FILIAL');

        return await this.filialsRepository.save(baseFilial);
    }
}