import { Message } from "src/messages/messages.entity";

export class ResponseMessages {
    user: string;
    userRole: string;
    message: string | null;
    fileName: string | null;
    fileUrl: string | null;
    room: string;

    constructor(model: Message) {
        this.message = model.messageText;
        this.room = model.chat.id.toString();
        this.user = model.sender;
        this.userRole = model.senderRole;
        this.fileName = model.fileName;
        this.fileUrl = model.fileUrl;
    }
}