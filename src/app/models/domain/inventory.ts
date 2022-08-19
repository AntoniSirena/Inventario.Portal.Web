import { Audit } from "../base/audit/audit";



export class Inventory {
    Id: number;
    Description: string;
    Status: string;
    StatuShortName: string;
    StatusColour: string;
    UserName: string;
    OpenDate: string;
    ClosedDate: string;
}

export class InventoryModel extends Audit {
    Id: number;
    Description: string;
    StatusId: number;
    UserId: number;
    OpenDate: string;
    ClosedDate: string;
}

export class Section {
    Id: number;
    Description: string;
    ShortName: string;
}

export class Tariff {
    Id: number;
    Description: string;
    ShortName: string;
}