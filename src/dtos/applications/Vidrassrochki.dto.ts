import { VidRassrochki } from "src/applications/vidrassrochki.entity";

export class VidRassrochkiDto {
    caption: string;
    idClient: number

    constructor(model: VidRassrochki) {
        this.caption = model.caption_long;
        this.idClient = model.enumorder;
    }
}