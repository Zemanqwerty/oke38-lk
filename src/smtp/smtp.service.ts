import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ClientProxy, ClientsModule } from "@nestjs/microservices";
import { SendSmtp } from "src/dtos/smtp/SendSmtp.dto";

@Injectable()
export class SmtpService {
    constructor(
        @Inject('SMTP_SERVICE') private smtpService: ClientProxy
    ) {};

    async sendSmtp(link: string, to: string, type: string) {
        try {
            const transferData = new SendSmtp({to: to, link: link, type: type})
            return await this.smtpService.send(
                { cmd: 'smtp' },
                transferData
            ).toPromise();
        } catch (e) {
            console.log(e);
            return e
        } finally {
            this.smtpService.close();
        }
    }

    // async sendResetPasswordLink(link: string, to: string) {
    //     try {
    //         const transferData = new SendSmtp({to: to, link: link})
    //         return await this.smtpService.send(
    //             { cmd: 'smtp' },
    //             transferData
    //         ).toPromise();
    //     } catch (e) {
    //         console.log(e);
    //         return e
    //     } finally {
    //         this.smtpService.close();
    //     }
    // }
}