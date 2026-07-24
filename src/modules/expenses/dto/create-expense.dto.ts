import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { IsId } from 'src/common/decorators/is-id';
import { CreateExpenseDetailDto } from './create-expense-detail.dto';

export class CreateExpenseDto {
    @IsString()
    @MaxLength(200)
    title!: string;

    @Type(() => Number)
    @IsId()
    locationId!: number;

    @IsOptional()
    @Type(() => Number)
    @IsId()
    ministryId?: number | null;

    @IsDateString()
    expenseDate!: Date;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    observation?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateExpenseDetailDto)
    details!: CreateExpenseDetailDto[];
}
