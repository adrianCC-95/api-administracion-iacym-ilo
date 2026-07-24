import { IsEnum, IsOptional, IsString } from 'class-validator';
import { IsId } from 'src/common/decorators/is-id';
import { IsDateString } from 'class-validator';
import { StatusFilter } from 'src/types/pagination';

export class ExportExpenseCriteriaDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsId()
    locationId?: number;

    @IsOptional()
    @IsId()
    ministryId?: number;

    @IsOptional()
    @IsId()
    registeredBy?: number;

    @IsOptional()
    @IsDateString()
    dateFrom?: Date;

    @IsOptional()
    @IsDateString()
    dateTo?: Date;

    @IsOptional()
    @IsEnum(StatusFilter)
    status?: StatusFilter;

    @IsOptional()
    @IsString()
    sortField?: string = 'createdAt';

    @IsOptional()
    @IsString()
    sortDirection?: 'ASC' | 'DESC' = 'DESC';

    @IsOptional()
    @IsString()
    exportFormat?: 'xlsx' | 'csv';
}
