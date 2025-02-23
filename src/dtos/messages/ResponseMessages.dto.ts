import { Message } from "src/messages/messages.entity";
import { AllUsersResponse } from "../users/AllUsersResponse";

export class ResponseMessages {
    user: AllUsersResponse;
    message: string | null;
    fileName: string | null;
    fileUrl: string | null;
    room: string;

    constructor(model: Message) {
        this.message = model.messageText;
        this.room = model.chat.id.toString();
        this.user = new AllUsersResponse(model.sender);
        this.fileName = model.fileName;
        this.fileUrl = model.fileUrl;
    }
}