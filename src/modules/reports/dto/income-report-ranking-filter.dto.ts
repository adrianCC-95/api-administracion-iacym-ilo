import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';
import { IsId } from '../../../common/decorators/is-id';

export class IncomeRankingFilterDto extends PaginationSortDto {
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

    @IsOptional()
    @IsIn(['total', 'count', 'average', 'member'])
    sortField?: string = 'total';

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortDirection?: 'ASC' | 'DESC' = 'DESC';
}
