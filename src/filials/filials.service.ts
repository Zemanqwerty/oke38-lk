import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Filials } from "./filials.entity";
import { Repository } from "typeorm";
import { Payload } from "src/dtos/auth/Payload.dto";
import { UsersService } from "src/users/users.service";
import { Role } from "src/roles/roles.enum";

@Injectable()
export class FilialService {
    constructor(
        @InjectRepository(Filials)
        private filialsRepository: Repository<Filials>,
        // private usersService: UsersService,
    ) {};

    async getFilialByCaption(caption: string) {
        return await this.filialsRepository.findOne({
            where: {
                caption_filial: caption
            }
        })
    }

    async getAllFilials() {
        // const user = await this.usersService.getUserByEmail(userData.publickUserEmail);

        // if (user.id_userrole.caption_userrole !== Role.Admin) {
        //     throw new HttpException('permission denied', HttpStatus.BAD_GATEWAY)
        // };

        return await this.filialsRepository.find();
    }

    async getFilialById(id: number) {
        return await this.filialsRepository.findOne({
            where: {
                id_filial: id
            }
        });
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