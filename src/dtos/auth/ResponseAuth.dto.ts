import { Role } from "src/roles/roles.enum";

export class ResponseAuth {
    email: string;
    role: Role;
    accessToken: string;

    constructor (model: {email: string, accessToken: string, role: Role}) {
        this.email = model.email;
        this.role = model.role;
        this.accessToken = model.accessToken;
    }
}