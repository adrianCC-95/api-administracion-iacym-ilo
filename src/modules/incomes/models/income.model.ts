import { Member } from 'src/modules/members/models/member.model';
import { IncomeType } from 'src/modules/income-types/models/income-type.model';
import { PaymentMethod } from 'src/modules/payment-methods/models/payment-method.model';
import { User } from 'src/modules/users/models/user.model';
import { File, FileResponse } from 'src/modules/files/models/file.model';

export class Income {
    id: number;

    member: Member;

    incomeType: IncomeType;

    paymentMethod: PaymentMethod;

    registeredBy: User;

    amount: number;

    incomeDate: Date;

    voucherFile: File | null;

    referenceNumber: string | null;

    observation: string | null;

    createdAt: Date;

    updatedAt: Date | null;

    deletedAt: Date | null;
}

export class IncomeResponse {
    id: number;

    member: Member;

    incomeType: IncomeType;

    paymentMethod: PaymentMethod;

    registeredBy: User;

    amount: number;

    incomeDate: Date;

    voucherFile?: FileResponse | null;

    referenceNumber: string | null;

    observation: string | null;

    createdAt: Date;

    isDeleted: boolean;
}
