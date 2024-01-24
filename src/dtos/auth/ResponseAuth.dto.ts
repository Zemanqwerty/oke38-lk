export class ResponseAuth {
    email: string;
    accessToken: string;
    refreshToken: string;

    constructor (model: {email: string, accessToken: string, refreshToken: string}) {
        this.email = model.email;
        this.accessToken = model.accessToken;
        this.refreshToken = model.refreshToken;
    }
}