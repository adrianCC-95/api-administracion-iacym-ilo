import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';
import { StatusFilter } from '../../../types/pagination';

export class FindIncomeTypeByCriteriaDto extends PaginationSortDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsEnum(StatusFilter)
    status?: StatusFilter;
}
