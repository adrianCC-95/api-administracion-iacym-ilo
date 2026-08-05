import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { IsId } from 'src/common/decorators/is-id';

export class IncomeSheetFilterDto {
    @IsNotEmpty()
    @IsDateString()
    date!: string;

    @IsOptional()
    @IsId()
    registeredById?: number;
}
