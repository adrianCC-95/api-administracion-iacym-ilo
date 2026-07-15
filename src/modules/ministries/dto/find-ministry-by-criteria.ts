import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';
import { StatusFilter } from '../../../types/pagination';

export class FindMinistryByCriteriaDto extends PaginationSortDto {
    @IsOptional()
    @IsString()
    @MaxLength(250)
    name?: string;

    @IsOptional()
    @IsEnum(StatusFilter)
    status?: StatusFilter;
}
