import { Contract } from "src/docsFiles/contract.entity";

export class ContractResponseDto {
    applicationId: string;
    contractId: string
    contractNumber: string;
    contractDate: Date;
    contractStatus: string;

    constructor (model: Contract) {
        this.applicationId = model.id_zayavka.id_zayavka;
        this.contractId = model.id_contractdoc;
        this.contractNumber = model.contract_number_1c;
        this.contractDate = model.contract_date_1c;
        this.contractStatus = model.id_contractstatus.caption_contractstatus;
    }
}