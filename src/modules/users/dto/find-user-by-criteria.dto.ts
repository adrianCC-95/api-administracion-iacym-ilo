import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsId } from '../../../common/decorators/is-id';
import { toNumberOrUndefined } from '../../../utils/transformers';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';
import { StatusFilter } from '../../../types/pagination';

export class FindUserByCriteriaDto extends PaginationSortDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    name?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    username?: string;

    @Transform(({ value }) => toNumberOrUndefined(value))
    @IsOptional()
    @IsId()
    locationId?: number;

    @Transform(({ value }) => toNumberOrUndefined(value))
    @IsOptional()
    @IsId()
    roleId?: number;

    @IsOptional()
    @IsEnum(StatusFilter)
    status?: StatusFilter;
}
