import { IsOptional, IsDateString } from 'class-validator';

export class GetDashboardQueryDto {
    @IsOptional()
    @IsDateString({}, { message: 'startDate debe ser una fecha en formato ISO (YYYY-MM-DD)' })
    startDate?: string;

    @IsOptional()
    @IsDateString({}, { message: 'endDate debe ser una fecha en formato ISO (YYYY-MM-DD)' })
    endDate?: string;
}
