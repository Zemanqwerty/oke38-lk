import { Applications } from "src/applications/applications.entity";
import { Users } from "src/users/users.entity";

export class ApplicationsResponse {
    uuid: string;
    userFirstName: string;
    userLastName: string;
    userSurname: string;
    userEmail: string;
    userPhoneNumber: string;
    userType: string;
    createdAt: Date;
    filial: string;
    applicationNumber: string;
    applicationDate: Date;
    powerLevel: string;
    cenovayaCat: string;
    paymentOption: string;
    vidzayavki: string;
    ststusoplaty: string;
    status: string;
    address: string;
    provider: string;
    reason: string;


    constructor (model: Applications,
        urovenU: string,
        cenovayaCat: string,
        vidrassrochki: string,
        vidzayavki: string,
        statusoplaty: string,
        statuszayavki: string,
        provider: string,
        reason: string)
    {
        this.uuid = model.uuid
        this.userFirstName = model.user.firstname
        this.userLastName = model.user.lastname
        this.userSurname = model.user.surname
        this.userEmail = model.user.email
        this.userPhoneNumber = model.user.phoneNumber
        this.userType = model.user.id_usertype.caption_usertype
        this.createdAt = model.createdAt
        this.filial = model.filial.caption_filial
        this.applicationNumber = model.applicationNumber
        this.applicationDate = model.applicationDate
        this.powerLevel = urovenU;
        this.cenovayaCat = cenovayaCat;
        this.paymentOption = vidrassrochki;
        this.vidzayavki = vidzayavki;
        this.ststusoplaty = statusoplaty;
        this.status = statuszayavki;
        this.address = model.address;
        this.provider = provider;
        this.reason = reason;
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