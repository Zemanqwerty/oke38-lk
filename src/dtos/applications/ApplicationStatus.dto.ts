import { ZayavkaStatus } from "src/applications/zayavkaststus.entity";


export class ApplicationStatusResponse {
    caption: string;
    idClient: number;

    constructor (model: ZayavkaStatus) {
        this.caption = model.caption_zayavkastatus;
        this.idClient = model.id_zayavkastatus;
    }
}