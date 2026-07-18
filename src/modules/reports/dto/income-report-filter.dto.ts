import { IsDateString, IsOptional } from 'class-validator';
import { IsId } from 'src/common/decorators/is-id';

export class IncomeReportFilterDto {
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsId()
    memberId?: number;

    @IsOptional()
    @IsId()
    incomeTypeId?: number;

    @IsOptional()
    @IsId()
    paymentMethodId?: number;

    @IsOptional()
    @IsId()
    registeredById?: number;
}
