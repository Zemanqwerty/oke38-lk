import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserTypes } from "./user-types.entity";

@Injectable()
export class UserTypesService {
    constructor(
        @InjectRepository(UserTypes)
        private userTypesRepository: Repository<UserTypes>,
    ) {};

    async getUserTypeByCaption(caption: string) {
        return await this.userTypesRepository.findOne({
            where: {
                caption_usertype: caption
            }
        })
    }

    async getUserTypeById(typeId: number) {
        return await this.userTypesRepository.findOne({
            where: {
                id_usertype: typeId
            }
        });
    }

    async onModuleInit() {
        const userTypes = await this.userTypesRepository.find();

        console.log(userTypes.length);

        // if (userTypes.length !== 0) {
        //     return
        // }

        // const fl = this.userTypesRepository.create({
        //     caption_usertype: 'физическое лицо'
        // })

        // const yl = this.userTypesRepository.create({
        //     caption_usertype: 'юридическое лицо'
        // })

        // const ip = this.userTypesRepository.create({
        //     caption_usertype: 'индивидуальный предприниматель'
        // })

        // await this.userTypesRepository.save(fl);
        // await this.userTypesRepository.save(yl);
        // await this.userTypesRepository.save(ip);

        return
    }
}