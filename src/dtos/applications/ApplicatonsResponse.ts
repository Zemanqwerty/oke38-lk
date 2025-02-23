import { Applications } from "src/applications/applications.entity";
import { StatusOplaty } from "src/applications/statusoplaty.entity";
import { Users } from "src/users/users.entity";

export class ApplicationsResponse {
    uuid: string;
    userFirstName: string | null;
    userLastName: string | null;
    userSurname: string | null;
    userEmail: string | null;
    userPhoneNumber: string | null;
    // userType: string | null;
    createdAt: Date | null;
    // filial: string | null;
    applicationNumber: string | null;
    applicationDate: Date | null;
    powerLevel: string | null;
    maxPower: number | null;
    cenovayaCat: string | null;
    paymentOption: string | null;
    vidzayavki: string | null;
    ststusoplaty: string | null;
    status: string | null;
    address: string | null;
    provider: string | null;
    reason: string | null;
    yl_fullname: string | null;
    yl_shortname: string | null;
    contact_familiya: string| null;
    filial?: string | null;
    isViewed: boolean;
    isFrom1c: boolean;
    statusDogovora: string | null;

    constructor (model: Applications,
        urovenU: string | null,
        cenovayaCat: string | null,
        vidrassrochki: string | null,
        vidzayavki: string | null,
        statusoplaty: StatusOplaty | null,
        statuszayavki: string | null,
        statusDogovora: string | null,
        provider: string | null,
        reason: string | null)
    {
        this.uuid = model.id_zayavka
        this.userFirstName = model.user.firstname
        this.userLastName = model.user.lastname
        this.userSurname = model.user.surname
        this.userEmail = model.user.email
        this.userPhoneNumber = model.user.phoneNumber
        // this.userType = model.user.id_usertype.caption_usertype
        this.createdAt = model.createdAt
        // this.filial = model.filial.caption_filial
        this.applicationNumber = model.applicationNumber
        this.applicationDate = model.applicationDate
        this.powerLevel = urovenU;
        this.cenovayaCat = cenovayaCat;
        this.paymentOption = vidrassrochki;
        this.vidzayavki = vidzayavki;
        this.ststusoplaty = statusoplaty == null ? null : statusoplaty.caption_long;
        // this.status = statuszayavki;
        this.status = model.status ? model.status.caption_zayavkastatus : null;
        this.address = model.address;
        this.provider = provider;
        this.reason = reason;
        // this.maxPower = parseFloat(model.maxPower.toString().split('.')[0] + model.maxPower.toString().split('.')[1][0]);
        this.maxPower = model.maxPower;
        this.yl_fullname = model.user.yl_fullname;
        this.yl_shortname = model.user.yl_shortname;
        this.contact_familiya = model.user.contact_familiya;
        this.filial = model.filial ? model.filial.caption_filial : null;
        this.isViewed = model.is_viewed;
        this.isFrom1c = model.date_copy_from1c ? true : false;
        this.statusDogovora = statusDogovora;
    }
}


// export interface ApplicationsResponse {
//     createdAt: Date;
//     id: number;
//     uuid: string;
//     reason: string;
//     city: string;
//     address: string;
//     maxPower: string;
//     powerLevel: string;
//     provider: string;
//     status: string;
//     paymentOption: string;
//     userId?: number;
//     userFirstName?: string;
//     userLastName?: string;
//     userSurname?: string;
//     userEmail?: string;
//     userPhoneNumber?: string;
//     userClientType?: string;
//     userType?: string;
//     filial?: string | null;
//     applicationNumber?: string | null;
// }