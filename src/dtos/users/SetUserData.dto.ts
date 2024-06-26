import { Role } from "src/roles/roles.enum";

export class SetUserData {
    email: string;
    role?: Role;
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    surname?: string;
}