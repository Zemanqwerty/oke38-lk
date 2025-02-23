import { UserRoles } from "src/user-roles/user-roles.entity";

export class UserRolesResponse {
    caption: string;
    idClient: number;

    constructor (model: UserRoles) {
        this.caption = model.caption_userrole;
        this.idClient = model.id_userrole;
    }
}