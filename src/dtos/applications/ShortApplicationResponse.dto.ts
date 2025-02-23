import { Applications } from "src/applications/applications.entity";

export class ShortApplicationResponse {
    uuid: string;
    filial: string | null;
    applicationNumber: string | null;
    applicationDate: Date | null;

    constructor (model: Applications) {
        this.uuid = model.id_zayavka;
        this.filial = model.filial ? model.filial.caption_filial_short : null;
        this.applicationNumber = model.applicationNumber;
        this.applicationDate = model.applicationDate;
    }
}