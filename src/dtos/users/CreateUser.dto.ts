import { Filials } from "src/filials/filials.entity";
import { Role } from "src/roles/roles.enum";
import { UserRoles } from "src/user-roles/user-roles.entity";
import { UserTypes } from "src/user-types/user-types.entity";

export class CreateUser {
    id_userrole?: UserRoles;
    id_usertype?: UserTypes;
    id_filial?: Filials;
    lastname: string;
    firstname: string;
    surname: string;
    yl_fullname?: string;
    yl_shortname?: string;
    inn?: string;
    contact_familiya?: string;
    contact_name?: string;
    contact_otchestvo?: string;
    email: string;
    phoneNumber: string;
    password: string;
    activationLink?: string;
    isActive?: boolean;
}