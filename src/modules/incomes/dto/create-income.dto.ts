import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { IsId } from 'src/common/decorators/is-id';

export class CreateIncomeDto {
    @Type(() => Number)
    @IsId()
    memberId!: number;

    @Type(() => Number)
    @IsId()
    incomeTypeId!: number;

    @Type(() => Number)
    @IsId()
    paymentMethodId!: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0.01)
    amount!: number;

    @IsDateString()
    incomeDate!: Date;

    @IsOptional()
    @Type(() => Number)
    @IsId()
    voucherFileId?: number | null; // en actualizar es opcional tambien, en caso que exista se reemplaza

    @IsOptional()
    @IsString()
    @MaxLength(100)
    referenceNumber?: string;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    observation?: string;
}
