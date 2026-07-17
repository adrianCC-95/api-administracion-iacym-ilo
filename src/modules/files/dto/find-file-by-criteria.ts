import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';
import { StatusFilter } from '../../../types/pagination';

export class FindFileByCriteriaDto extends PaginationSortDto {
    @IsOptional()
    @IsString()
    originalName?: string;

    @IsOptional()
    @IsEnum(StatusFilter)
    status?: StatusFilter;
}
