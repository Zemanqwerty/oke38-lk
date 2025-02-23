// import { UserRoles } from "src/user-roles/user-roles.entity";

import { UserTypes } from "src/user-types/user-types.entity";

export class UserTypesResponse {
    caption: string;
    idClient: number;

    constructor (model: UserTypes) {
        this.caption = model.caption_usertype;
        this.idClient = model.id_usertype;
    }
}