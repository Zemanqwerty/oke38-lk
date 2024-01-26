export class SendSmtp {
    to: string;
    link: string;
    type: string

    constructor (model: {to: string, link: string, type: string}) {
        this.to = model.to;
        this.link = model.link;
        this.type = model.type;
    }
}