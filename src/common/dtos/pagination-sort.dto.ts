import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { toNumberOrUndefined } from '../../utils/transformers';
import { SortDirection } from '../../types/pagination';

export class PaginationSortDto {
    @Transform(({ value }) => toNumberOrUndefined(value))
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number = 1;

    @Transform(({ value }) => toNumberOrUndefined(value))
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(250)
    size?: number = 10;

    @IsOptional()
    @IsString()
    sortField?: string = 'createdAt';

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortDirection?: SortDirection = 'DESC';
}
