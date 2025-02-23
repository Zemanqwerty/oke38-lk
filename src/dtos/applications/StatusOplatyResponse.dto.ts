import { StatusOplaty } from "src/applications/statusoplaty.entity";

export class StatusOplatyResponse {
    caption: string;
    idClient: number;

    constructor (model: StatusOplaty) {
        this.caption = model.caption_long;
        this.idClient = model.enumorder;
    }
}