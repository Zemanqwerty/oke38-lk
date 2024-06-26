import { Filials } from "src/filials/filials.entity";
import { Role } from "src/roles/roles.enum";
import { UserRoles } from "src/user-roles/user-roles.entity";
import { UserTypes } from "src/user-types/user-types.entity";
import { Users } from "src/users/users.entity";

export class AllUsersResponse {
    id_userrole?: string;
    id_usertype?: UserTypes;
    id_filial?: Filials;
    lastname: string | null;
    firstname: string | null;
    surname: string | null;
    yl_fullname?: string | null;
    yl_shortname?: string | null;
    inn?: string | null;
    contact_familiya?: string | null;
    contact_name?: string | null;
    contact_otchestvo?: string | null;
    email: string | null;
    phoneNumber: string | null;
    islockedout: boolean | null
    createdAt: Date | null;

    constructor (model: Users) {
        this.id_usertype = model.id_usertype
        this.lastname = model.lastname
        this.firstname = model.firstname
        this.surname = model.surname
        this.yl_fullname = model.yl_fullname
        this.yl_shortname = model.yl_shortname
        this.inn = model.inn
        this.contact_familiya = model.contact_familiya
        this.contact_name = model.contact_name
        this.contact_otchestvo = model.contact_otchestvo
        this.email = model.email
        this.phoneNumber = model.phoneNumber
        this.id_userrole = model.id_userrole.caption_userrole
        this.createdAt = model.date_create_user
    }
}