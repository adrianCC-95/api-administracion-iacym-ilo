import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { IsId } from 'src/common/decorators/is-id';

export class CreateIncomeDto {
    @IsId()
    memberId!: number;

    @IsId()
    incomeTypeId!: number;

    @IsId()
    paymentMethodId!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0.01)
    amount!: number;

    @IsDateString()
    incomeDate!: Date;

    @IsOptional()
    @IsId()
    voucherFileId?: number | null;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    referenceNumber?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    observation?: string;
}
