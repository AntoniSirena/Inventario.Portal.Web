import { Audit } from "../base/audit/audit";

export class Product {
    Id: number;
    Description: string;
    ExternalCode: string;
    BarCode: string;
    OldCost: number;
    OldPrice: number;
    Cost: number;
    Price: number;
    InventoryId: number;
    InventoryDetailId: number;
    Quantity: number;
    UserName: string;
}

export class ProductModel extends Audit {
    Id: number;
    Description: string;
    FormattedDescription: string;
    ExternalCode: string;
    BarCode: string;
    Cost: number;
    Price: number;
}