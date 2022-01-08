import { Iaudit } from "../base/Iaudit/iaudit";

export interface Iinventory extends Iaudit {
    Id: number;
    Description: string;
    StatusId: number;
    UserId: number;
    OpenDate: string;
    ClosedDate: string;
}