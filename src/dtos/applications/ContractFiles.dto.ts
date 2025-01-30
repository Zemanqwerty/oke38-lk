import { ContractDoc } from "src/docsFiles/contractdoc.entity";

export class ContractFilesDto {
    applicatioId: string;
    contractId: string;
    doctype: string;
    file_path: string;
    file_name: string;
    dateOfCreate: Date;

    constructor (model: ContractDoc) {
        this.applicatioId = model.id_contract.id_zayavka.id_zayavka;
        this.contractId = model.id_contract.id_contractdoc;
        this.doctype = model.id_doctype.caption_doctype;
        this.file_path = model.doc_file_path;
        this.file_name = model.doc_file_name;
        this.dateOfCreate = model.date_doc_add;
    }
}