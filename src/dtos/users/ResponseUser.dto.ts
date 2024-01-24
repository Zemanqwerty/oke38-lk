export class ResponseUser {
    email: string;

    constructor (model: {email: string}) {
        this.email = model.email;
    }
}