import { IsEnum, IsOptional } from 'class-validator';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';
import { IsId } from 'src/common/decorators/is-id';
import { IsDateString } from 'class-validator';
import { StatusFilter } from 'src/types/pagination';

export class FindIncomeByCriteriaDto extends PaginationSortDto {
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
    registeredBy?: number;

    @IsOptional()
    @IsDateString()
    dateFrom?: Date;

    @IsOptional()
    @IsDateString()
    dateTo?: Date;

    @IsOptional()
    @IsEnum(StatusFilter)
    status?: StatusFilter;
}
