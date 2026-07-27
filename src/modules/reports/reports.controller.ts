import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';

import { ReportsService } from './reports.service';
import { IncomeReportFilterDto } from './dto/income-report-filter.dto';
import { RequireAuth } from 'src/common/decorators/require-auth';
import { IncomeRankingFilterDto } from './dto/income-report-ranking-filter.dto';
import { ExpenseReportFilterDto } from './dto/expense-report-filter.dto';

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

    // CONTROLADORES DE EGRESOS

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('expenses/summary')
    async expenseSummary(@Query() filters: ExpenseReportFilterDto) {
        return this.reportsService.expenseSummary(filters);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('expenses/monthly')
    async expenseMonthly(@Query() filters: ExpenseReportFilterDto) {
        return this.reportsService.expenseMonthly(filters);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('expenses/by-type')
    async expenseByType(@Query() filters: ExpenseReportFilterDto) {
        return this.reportsService.expenseByType(filters);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('expenses/by-payment-method')
    async expenseByPaymentMethod(@Query() filters: ExpenseReportFilterDto) {
        return this.reportsService.expenseByPaymentMethod(filters);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('expenses/by-supplier')
    async expenseBySupplier(@Query() filters: ExpenseReportFilterDto) {
        return this.reportsService.expenseBySupplier(filters);
    }
}
