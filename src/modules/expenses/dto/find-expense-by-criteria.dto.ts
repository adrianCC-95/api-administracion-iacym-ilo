import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';
import { IsId } from 'src/common/decorators/is-id';
import { IsDateString } from 'class-validator';
import { StatusFilter } from 'src/types/pagination';

export class FindExpenseByCriteriaDto extends PaginationSortDto {
    @IsOptional()
    @IsString()
    search?: string; // Busca en título o proveedor/comprobante

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
}
