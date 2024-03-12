import { Applications } from "src/applications/applications.entity";

export class ApplicationsResponse {
    createdAt: Date;
    id: number;
    city: string;
    address: string;
    maxPower: string;
    powerLevel: string;
    provider: string;
    status: string;

    constructor (model: Applications) {
        this.createdAt = model.createdAt;
        this.id = model.id;
        this.city = model.city;
        this.address = model.address;
        this.maxPower = model.maxPower;
        this.powerLevel = model.powerLevel;
        this.provider = model.provider;
        this.status = model.status;
    }
}