import { IsDateString, IsOptional } from 'class-validator';
import { IsId } from 'src/common/decorators/is-id';

export class ExpenseReportFilterDto {
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsId()
    locationId?: number;

    @IsOptional()
    @IsId()
    ministryId?: number;

    @IsOptional()
    @IsId()
    expenseTypeId?: number;

    @IsOptional()
    @IsId()
    paymentMethodId?: number;

    @IsOptional()
    @IsId()
    registeredById?: number;
}
