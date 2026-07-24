import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';
import { IsId } from '../../../common/decorators/is-id';

export class ExpenseRankingFilterDto extends PaginationSortDto {
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
    @IsIn(['total', 'count', 'average', 'supplier'])
    sortField?: string = 'total';

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortDirection?: 'ASC' | 'DESC' = 'DESC';
}
