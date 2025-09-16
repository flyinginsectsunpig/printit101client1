import { User } from "./User";

export interface Customer extends User {
    customerId?: number;
    customerDiscount: number;
    token?: string;
}
