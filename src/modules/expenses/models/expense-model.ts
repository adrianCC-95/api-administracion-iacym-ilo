import { Location } from 'src/modules/locations/models/location.model';
import { Ministry } from 'src/modules/ministries/models/ministry.model';
import { User } from 'src/modules/users/models/user.model';
import { ExpenseType } from 'src/modules/expense-types/models/expense-type.model';
import { PaymentMethod } from 'src/modules/payment-methods/models/payment-method.model';
import { File, FileResponse } from 'src/modules/files/models/file.model';
import { VoucherType } from '../dto/create-expense-detail.dto';

export class ExpenseDetail {
    id: number;
    expenseType: ExpenseType;
    paymentMethod: PaymentMethod;
    voucherFile: File | null;
    supplierOrBeneficiary: string;
    voucherType: VoucherType;
    voucherNumber: string | null;
    amount: number;
    conceptDetail: string;
}

export class Expense {
    id: number;
    title: string;
    location: Location;
    ministry: Ministry | null;
    registeredBy: User;
    totalAmount: number;
    expenseDate: Date;
    observation: string | null;
    details: ExpenseDetail[];
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class ExpenseDetailResponse {
    id: number;
    expenseType: ExpenseType;
    paymentMethod: PaymentMethod;
    voucherFile?: FileResponse | null;
    supplierOrBeneficiary: string;
    voucherType: VoucherType;
    voucherNumber: string | null;
    amount: number;
    conceptDetail: string;
}

export class ExpenseResponse {
    id: number;
    title: string;
    location: Location;
    ministry: Ministry | null;
    registeredBy: User;
    totalAmount: number;
    expenseDate: Date;
    observation: string | null;
    details: ExpenseDetailResponse[];
    createdAt: Date;
    isDeleted: boolean;
}
