import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { IsDateString } from 'class-validator';
import { StatusFilter } from 'src/types/pagination';
import { Type } from 'class-transformer';

export class ExportMemberCriteriaDto {
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
    birthMonth?: number;

    @IsOptional()
    @IsString()
    sortField?: string = 'createdAt';

    @IsOptional()
    @IsString()
    sortDirection?: 'ASC' | 'DESC' = 'DESC';
}
