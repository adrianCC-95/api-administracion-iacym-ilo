import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { ReportsService } from './reports.service';
import { IncomeReportFilterDto } from './dto/income-report-filter.dto';
import { RequireAuth } from 'src/common/decorators/require-auth';
import { IncomeRankingFilterDto } from './dto/income-report-ranking-filter.dto';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('incomes/summary')
    async incomeSummary(@Query() filters: IncomeReportFilterDto) {
        return this.reportsService.incomeSummary(filters);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('incomes/monthly')
    async incomeMonthly(@Query() filters: IncomeReportFilterDto) {
        console.log('filtros desde controlador', filters);
        return this.reportsService.incomeMonthly(filters);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('incomes/by-type')
    async incomeByType(@Query() filters: IncomeReportFilterDto) {
        return this.reportsService.incomeByType(filters);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('incomes/by-payment-method')
    async incomeByPaymentMethod(@Query() filters: IncomeReportFilterDto) {
        console.log('filtros desde controlador', filters);
        return this.reportsService.incomeByPaymentMethod(filters);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('incomes/by-member')
    async incomeByMember(@Query() filters: IncomeReportFilterDto) {
        return this.reportsService.incomeByMember(filters);
    }

    @Get('incomes/by-member-paginated')
    async incomeByMemberPaginated(@Query() criteria: IncomeRankingFilterDto) {
        return this.reportsService.incomeByMemberPaginated(criteria);
    }
}
