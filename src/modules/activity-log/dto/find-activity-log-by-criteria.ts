import { IsOptional, IsString, IsNumber } from 'class-validator';
import { IsId } from '../../../common/decorators/is-id';
import { PaginationSortDto } from '../../../common/dtos/pagination-sort.dto';

export class FindActivityLogByCriteriaDto extends PaginationSortDto {
    @IsOptional()
    @IsString()
    actionType?: string;

    @IsOptional()
    @IsId()
    @IsNumber()
    authorId?: number;

    @IsOptional()
    @IsId()
    @IsNumber()
    targetId?: number;

    @IsOptional()
    @IsString()
    targetTable?: number;
}
