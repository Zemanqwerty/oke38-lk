import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRoles } from "./user-roles.entity";

@Injectable()
export class UserRolesService {
    constructor(
        @InjectRepository(UserRoles)
        private userRolesRepository: Repository<UserRoles>,
    ) {};

    async getRoleByCaption(caption: string) {
        return await this.userRolesRepository.findOne({
            where: {
                caption_userrole: caption
            }
        })
    }

    async onModuleInit() {
        const userRoles = await this.userRolesRepository.find();

        if (userRoles.length !== 0) {
            return
        }

        const clientRole = this.userRolesRepository.create({
            caption_userrole: 'заявитель'
        })

        const adminRole = this.userRolesRepository.create({
            caption_userrole: 'администратор'
        })

        const operatorFilial = this.userRolesRepository.create({
            caption_userrole: 'оператор (филиал)'
        })

        const operatorAUP = this.userRolesRepository.create({
            caption_userrole: 'оператор (АУП)'
        })

        const operatorGP = this.userRolesRepository.create({
            caption_userrole: 'оператор (ГП)'
        })

        const callCenter = this.userRolesRepository.create({
            caption_userrole: 'Call Center'
        })

        console.log('CREATING BASE USER-ROLES');

        await this.userRolesRepository.save(clientRole);
        await this.userRolesRepository.save(adminRole);
        await this.userRolesRepository.save(operatorFilial);
        await this.userRolesRepository.save(operatorAUP);
        await this.userRolesRepository.save(operatorGP);
        await this.userRolesRepository.save(callCenter);

        return
    }
}