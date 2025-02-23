import { ContractSatatus } from "src/docsFiles/contractstatus.entity";

export class ContractStatus {
    clientId: number;
    caption: string;

    constructor(model: ContractSatatus) {
        this.clientId = model.id_contractstatus;
        this.caption = model.caption_contractstatus;
    }
}