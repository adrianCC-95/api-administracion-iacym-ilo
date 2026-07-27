import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './repositories/reports.repository';
import { IncomeReportFilterDto } from './dto/income-report-filter.dto';
import { IncomeRankingFilterDto } from './dto/income-report-ranking-filter.dto';
import { IncomeReportMapper } from './mappers/income-report.mapper';
import { ExpenseReportFilterDto } from './dto/expense-report-filter.dto';

@Injectable()
export class ReportsService {
    constructor(private readonly reportsRepository: ReportsRepository) {}

    async incomeSummary(filters: IncomeReportFilterDto) {
        return this.reportsRepository.incomeSummary(filters);
    }

    async incomeMonthly(filters: IncomeReportFilterDto) {
        return this.reportsRepository.incomeMonthly(filters);
    }

    async incomeDaily(filters: IncomeReportFilterDto) {
        return this.reportsRepository.incomeDaily(filters);
    }

    async incomeByType(filters: IncomeReportFilterDto) {
        return this.reportsRepository.incomeByType(filters);
    }

    async incomeByPaymentMethod(filters: IncomeReportFilterDto) {
        return this.reportsRepository.incomeByPaymentMethod(filters);
    }

    async incomeByMember(filters: IncomeReportFilterDto) {
        return this.reportsRepository.incomeByMember(filters);
    }
    async incomeByMemberPaginated(criteria: IncomeRankingFilterDto) {
        const entities = await this.reportsRepository.incomeByMemberPaginated(criteria);

        return IncomeReportMapper.toIncomeByMemberList(entities, criteria.page, criteria.size);
    }

    // SERVICIOS DE EGRESOS
    async expenseSummary(filters: ExpenseReportFilterDto) {
        return this.reportsRepository.expenseSummary(filters);
    }

    async expenseDaily(filters: ExpenseReportFilterDto) {
        return this.reportsRepository.expenseDaily(filters);
    }

    async expenseMonthly(filters: ExpenseReportFilterDto) {
        return this.reportsRepository.expenseMonthly(filters);
    }

    async expenseByType(filters: ExpenseReportFilterDto) {
        return this.reportsRepository.expenseByType(filters);
    }

    async expenseByPaymentMethod(filters: ExpenseReportFilterDto) {
        return this.reportsRepository.expenseByPaymentMethod(filters);
    }

    async expenseBySupplier(filters: ExpenseReportFilterDto) {
        return this.reportsRepository.expenseBySupplier(filters);
    }
}
