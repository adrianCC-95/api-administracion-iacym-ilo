import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { IsId } from 'src/common/decorators/is-id';

export enum VoucherType {
    BOLETA = 'BOLETA',
    FACTURA = 'FACTURA',
    NOTA_DE_PEDIDO = 'NOTA_DE_PEDIDO',
    RECIBO_HONORARIOS = 'RECIBO_HONORARIOS',
    TICKET = 'TICKET',
    OTRO = 'OTRO',
}

export class CreateExpenseDetailDto {
    @Type(() => Number)
    @IsId()
    expenseTypeId!: number;

    @Type(() => Number)
    @IsId()
    paymentMethodId!: number;

    @IsString()
    @MaxLength(150)
    supplierOrBeneficiary!: string;

    @IsEnum(VoucherType)
    voucherType!: VoucherType;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    voucherNumber?: string;

    @Type(() => Number)
    @IsNumber()
    @Min(0.01)
    amount!: number;

    @IsString()
    @MaxLength(255)
    conceptDetail!: string;

    @IsOptional()
    @Type(() => Number)
    @IsId()
    voucherFileId?: number | null;
}
