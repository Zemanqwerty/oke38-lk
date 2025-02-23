import { Message } from "src/messages/messages.entity";
import { ApplicationsResponse } from "../applications/ApplicatonsResponse";
import { AllUsersResponse } from "../users/AllUsersResponse";
import { ShortApplicationResponse } from "../applications/ShortApplicationResponse.dto";

export class LastMesages {
    user: AllUsersResponse;
    application: ShortApplicationResponse;
    isFile: boolean;
    messageClientId: number;
    sendDate: Date;

    constructor (model: Message) {
        this.user = new AllUsersResponse(model.sender);
        this.application = new ShortApplicationResponse(model.chat.application);
        this.isFile = model.fileUrl ? true : false;
        this.messageClientId = model.id;
        this.sendDate = model.createdAt;
    }
}