import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationSortDto } from 'src/common/dtos/pagination-sort.dto';
import { StatusFilter } from 'src/types/pagination';

export class FindPositionByCriteriaDto extends PaginationSortDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEnum(StatusFilter)
    status?: StatusFilter;
}
