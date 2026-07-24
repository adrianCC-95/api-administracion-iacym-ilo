import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';
import { StatusFilter } from '../../../types/pagination';
import { Type } from 'class-transformer';

export class FindMemberByCriteriaDto extends PaginationSortDto {
    @IsOptional()
    @IsString()
    @MaxLength(250)
    name?: string;

    @IsOptional()
    @IsEnum(StatusFilter)
    status?: StatusFilter;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    ministryId?: number;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    positionId?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(12)
    birthMonth?: number; // Representa el mes (1 = Enero, 12 = Diciembre)
}
