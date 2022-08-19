import { Iaudit } from "../base/Iaudit/iaudit";

export interface Iproduct extends Iaudit {
    Id: number;
    Description: string;
    FormattedDescription: string;
    ExternalCode: string;
    BarCode: string;
    Cost: number;
    Price: number;
    Reference: string;
    Existence: number;
}