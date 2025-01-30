import { DogovorEnergo } from "src/docsFiles/dogovorenergo.entity";
import { AllUsersResponse } from "../users/AllUsersResponse";

export class DogovorEnergoDto {

    dateOfCreateDogovor: Date;
    user: AllUsersResponse;
    dateOfCreateApplication: Date;
    applicationNumber: string;
    applicationDate: Date;
    application_status: string | null;
    address_epu: string;
    dogovorNumber: string;
    schetNumber: string;
    epuNumber: string;
    applicationId: string;

    constructor (
        model: DogovorEnergo
    ) {
        this.dateOfCreateDogovor = model.date_create_de;
        this.user = new AllUsersResponse(model.id_zayavka.user);
        this.dateOfCreateApplication = model.id_zayavka.createdAt;
        this.applicationNumber = model.id_zayavka.applicationNumber;
        this.applicationDate = model.id_zayavka.applicationDate;
        this.application_status = model.id_zayavka.status?.caption_zayavkastatus || null;
        this.address_epu = model.id_zayavka.address;
        this.dogovorNumber = model.nomer_dogovorenergo;
        this.schetNumber = model.nomer_ls;
        this.epuNumber = model.nomer_elektroustanovka;
        this.applicationId = model.id_zayavka.id_zayavka;
    }
}