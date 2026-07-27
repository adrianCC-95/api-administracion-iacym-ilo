import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { IncomeEntity } from '../../incomes/entities/income.entity';
import { ReportsRepositoryImpl } from './reports.repository.impl';
import { IncomeReportFilterDto } from '../dto/income-report-filter.dto';
import { IncomeMonthlyResponse } from '../responses/income-monthly.response';
import { IncomeSummaryResponse } from '../responses/income-summary.response';
import { IncomeByTypeResponse } from '../responses/income-by-type.response';
import { IncomeByPaymentMethodResponse } from '../responses/income-by-payment-method.response';
import { IncomeByMemberResponse } from '../responses/income-by-member.response';
import { IncomeRankingFilterDto } from '../dto/income-report-ranking-filter.dto';
import { PaginatedResult } from 'src/types/pagination';
import { Query } from 'src/utils/query';
import { IncomeByMemberEntity } from '../entities/income-by-member.entity';
import { ExpenseReportFilterDto } from '../dto/expense-report-filter.dto';
import { ExpenseEntity } from 'src/modules/expenses/entities/expense.entity';

@Injectable()
export class ReportsRepository implements ReportsRepositoryImpl {
    constructor(
        @InjectRepository(IncomeEntity)
        private readonly repository: Repository<IncomeEntity>,
        @InjectRepository(ExpenseEntity)
        private readonly expenseRepository: Repository<ExpenseEntity>,
    ) {}

    async incomeSummary(filters: IncomeReportFilterDto): Promise<IncomeSummaryResponse> {
        const qb = this.repository
            .createQueryBuilder('income')
            .leftJoin('income.member', 'member')
            .leftJoin('income.incomeType', 'incomeType')
            .leftJoin('income.paymentMethod', 'paymentMethod')
            .leftJoin('income.registeredBy', 'registeredBy');

        this.applyFilters(qb, filters);

        const result = await qb
            .select('COALESCE(SUM(income.amount),0)', 'total')
            .addSelect('COUNT(income.id)', 'count')
            .getRawOne();

        return {
            total: Number(result.total),
            count: Number(result.count),
            average: Number(result.count) > 0 ? Number(result.total) / Number(result.count) : 0,
        };
    }

    private applyFilters(qb: SelectQueryBuilder<IncomeEntity>, filters: IncomeReportFilterDto) {
        if (filters.startDate) {
            qb.andWhere('income.incomeDate >= :startDate', {
                startDate: filters.startDate,
            });
        }

        if (filters.endDate) {
            qb.andWhere('income.incomeDate <= :endDate', {
                endDate: filters.endDate,
            });
        }

        if (filters.memberId) {
            qb.andWhere('income.member.id = :memberId', {
                memberId: filters.memberId,
            });
        }

        if (filters.incomeTypeId) {
            qb.andWhere('income.incomeType.id = :incomeTypeId', {
                incomeTypeId: filters.incomeTypeId,
            });
        }

        if (filters.paymentMethodId) {
            qb.andWhere('income.paymentMethod.id = :paymentMethodId', {
                paymentMethodId: filters.paymentMethodId,
            });
        }

        if (filters.registeredById) {
            qb.andWhere('income.registeredBy.id = :registeredById', {
                registeredById: filters.registeredById,
            });
        }
    }

    async incomeMonthly(filters: IncomeReportFilterDto): Promise<IncomeMonthlyResponse[]> {
        const qb = this.repository
            .createQueryBuilder('income')
            .leftJoin('income.member', 'member')
            .leftJoin('income.incomeType', 'incomeType')
            .leftJoin('income.paymentMethod', 'paymentMethod')
            .leftJoin('income.registeredBy', 'registeredBy');

        this.applyFilters(qb, filters);

        const rows = await qb
            .select('YEAR(income.incomeDate)', 'year')
            .addSelect('MONTH(income.incomeDate)', 'month')
            .addSelect('COUNT(income.id)', 'count')
            .addSelect('SUM(income.amount)', 'total')
            .groupBy('YEAR(income.incomeDate)')
            .addGroupBy('MONTH(income.incomeDate)')
            .orderBy('year', 'ASC')
            .addOrderBy('month', 'ASC')
            .getRawMany();

        const months = [
            '',
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];

        return rows.map((row) => ({
            year: Number(row.year),
            month: Number(row.month),
            monthName: months[Number(row.month)],
            count: Number(row.count),
            total: Number(row.total),
        }));
    }

    async incomeDaily(filters: IncomeReportFilterDto) {
        const qb = this.repository
            .createQueryBuilder('income')
            .leftJoin('income.member', 'member')
            .leftJoin('income.incomeType', 'incomeType')
            .leftJoin('income.paymentMethod', 'paymentMethod')
            .leftJoin('income.registeredBy', 'registeredBy');

        this.applyFilters(qb, filters);

        const rows = await qb
            .select('DAY(income.incomeDate)', 'day')
            .addSelect('SUM(income.amount)', 'total')
            .groupBy('DAY(income.incomeDate)')
            .orderBy('day', 'ASC')
            .getRawMany();

        return rows.map((row) => ({
            day: Number(row.day),
            total: Number(row.total || 0),
        }));
    }

    async incomeByType(filters: IncomeReportFilterDto): Promise<IncomeByTypeResponse[]> {
        const qb = this.repository
            .createQueryBuilder('income')
            .leftJoin('income.member', 'member')
            .leftJoin('income.incomeType', 'incomeType')
            .leftJoin('income.paymentMethod', 'paymentMethod')
            .leftJoin('income.registeredBy', 'registeredBy');

        this.applyFilters(qb, filters);

        const rows = await qb
            .select('incomeType.id', 'incomeTypeId')
            .addSelect('incomeType.name', 'incomeType')
            .addSelect('COUNT(income.id)', 'count')
            .addSelect('SUM(income.amount)', 'total')
            .groupBy('incomeType.id')
            .addGroupBy('incomeType.name')
            .orderBy('total', 'DESC')
            .getRawMany();

        const grandTotal = rows.reduce((sum, row) => sum + Number(row.total), 0);

        return rows.map((row) => ({
            incomeTypeId: Number(row.incomeTypeId),
            incomeType: row.incomeType,
            count: Number(row.count),
            total: Number(row.total),
            percentage: grandTotal === 0 ? 0 : Number(((Number(row.total) * 100) / grandTotal).toFixed(2)),
        }));
    }

    async incomeByPaymentMethod(filters: IncomeReportFilterDto): Promise<IncomeByPaymentMethodResponse[]> {
        const qb = this.repository
            .createQueryBuilder('income')
            .leftJoin('income.member', 'member')
            .leftJoin('income.incomeType', 'incomeType')
            .leftJoin('income.paymentMethod', 'paymentMethod')
            .leftJoin('income.registeredBy', 'registeredBy');

        this.applyFilters(qb, filters);

        const rows = await qb
            .select('paymentMethod.id', 'paymentMethodId')
            .addSelect('paymentMethod.name', 'paymentMethod')
            .addSelect('COUNT(income.id)', 'count')
            .addSelect('SUM(income.amount)', 'total')
            .groupBy('paymentMethod.id')
            .addGroupBy('paymentMethod.name')
            .orderBy('total', 'DESC')
            .getRawMany();

        const grandTotal = rows.reduce((sum, row) => sum + Number(row.total), 0);

        return rows.map((row) => ({
            paymentMethodId: Number(row.paymentMethodId),
            paymentMethod: row.paymentMethod,
            count: Number(row.count),
            total: Number(row.total),
            percentage: grandTotal === 0 ? 0 : Number(((Number(row.total) * 100) / grandTotal).toFixed(2)),
        }));
    }

    async incomeByMember(filters: IncomeReportFilterDto): Promise<IncomeByMemberResponse[]> {
        const qb = this.repository
            .createQueryBuilder('income')
            .leftJoin('income.member', 'member')
            .leftJoin('income.incomeType', 'incomeType')
            .leftJoin('income.paymentMethod', 'paymentMethod')
            .leftJoin('income.registeredBy', 'registeredBy');

        this.applyFilters(qb, filters);

        const rows = await qb
            .select('member.id', 'memberId')
            .addSelect("CONCAT(member.name, ' ', member.last_name)", 'member')
            .addSelect('COUNT(income.id)', 'count')
            .addSelect('SUM(income.amount)', 'total')
            .addSelect('AVG(income.amount)', 'average')
            .addSelect('MIN(income.incomeDate)', 'firstIncome')
            .addSelect('MAX(income.incomeDate)', 'lastIncome')
            .groupBy('member.id')
            .addGroupBy('member.name')
            .addGroupBy('member.last_name')
            .orderBy('total', 'DESC')
            .getRawMany();

        return rows.map((row, index) => ({
            rank: index + 1,

            memberId: Number(row.memberId),

            member: row.member,

            count: Number(row.count),

            total: Number(row.total),

            average: Number(Number(row.average).toFixed(2)),

            firstIncome: row.firstIncome,

            lastIncome: row.lastIncome,
        }));
    }
    async incomeByMemberPaginated(criteria: IncomeRankingFilterDto): Promise<PaginatedResult<IncomeByMemberEntity>> {
        const qb = this.repository.createQueryBuilder('income').leftJoin('income.member', 'member');

        if (criteria.startDate) {
            qb.andWhere('income.incomeDate >= :startDate', {
                startDate: criteria.startDate,
            });
        }

        if (criteria.endDate) {
            qb.andWhere('income.incomeDate <= :endDate', {
                endDate: criteria.endDate,
            });
        }

        qb.select('member.id', 'memberId')
            .addSelect("CONCAT(member.name,' ',member.last_name)", 'member')
            .addSelect('COUNT(income.id)', 'count')
            .addSelect('SUM(income.amount)', 'total')
            .addSelect('AVG(income.amount)', 'average')
            .addSelect('MIN(income.incomeDate)', 'firstIncome')
            .addSelect('MAX(income.incomeDate)', 'lastIncome')
            .groupBy('member.id')
            .addGroupBy('member.name')
            .addGroupBy('member.last_name');

        const sortFields = {
            total: 'total',
            count: 'count',
            average: 'average',
            member: 'member',
        };

        const sortColumn = sortFields[criteria.sortField ?? 'total'];

        qb.orderBy(sortColumn, criteria.sortDirection ?? 'DESC');

        return Query.fetchPagedRaw<IncomeByMemberEntity>(qb, criteria.page, criteria.size);
    }

    // REPORTES DE GASTOS

    async expenseSummary(filters: ExpenseReportFilterDto) {
        const qb = this.expenseRepository.createQueryBuilder('expense').leftJoin('expense.details', 'details');

        this.applyExpenseFilters(qb, filters);

        const result = await qb
            .select('COALESCE(SUM(details.amount), 0)', 'total')
            .addSelect('COUNT(DISTINCT expense.id)', 'count')
            .getRawOne();

        const total = Number(result.total);
        const count = Number(result.count);

        return {
            total,
            count,
            average: count > 0 ? Number((total / count).toFixed(2)) : 0,
        };
    }

    async expenseDaily(filters: ExpenseReportFilterDto) {
        const qb = this.expenseRepository.createQueryBuilder('expense').leftJoin('expense.details', 'details');

        this.applyExpenseFilters(qb, filters);

        const rows = await qb
            .select('DAY(expense.expenseDate)', 'day')
            .addSelect('SUM(details.amount)', 'total')
            .groupBy('DAY(expense.expenseDate)')
            .orderBy('day', 'ASC')
            .getRawMany();

        return rows.map((row) => ({
            day: Number(row.day),
            total: Number(row.total || 0),
        }));
    }
    async expenseMonthly(filters: ExpenseReportFilterDto) {
        const qb = this.expenseRepository.createQueryBuilder('expense').leftJoin('expense.details', 'details');

        this.applyExpenseFilters(qb, filters);

        const rows = await qb
            .select('YEAR(expense.expenseDate)', 'year')
            .addSelect('MONTH(expense.expenseDate)', 'month')
            .addSelect('COUNT(DISTINCT expense.id)', 'count')
            .addSelect('SUM(details.amount)', 'total')
            .groupBy('YEAR(expense.expenseDate)')
            .addGroupBy('MONTH(expense.expenseDate)')
            .orderBy('year', 'ASC')
            .addOrderBy('month', 'ASC')
            .getRawMany();

        const months = [
            '',
            'Enero',
            'Febrero',
            'Marzo',
            'Abril',
            'Mayo',
            'Junio',
            'Julio',
            'Agosto',
            'Septiembre',
            'Octubre',
            'Noviembre',
            'Diciembre',
        ];

        return rows.map((row) => ({
            year: Number(row.year),
            month: Number(row.month),
            monthName: months[Number(row.month)],
            count: Number(row.count),
            total: Number(row.total),
        }));
    }

    async expenseByType(filters: ExpenseReportFilterDto) {
        const qb = this.expenseRepository
            .createQueryBuilder('expense')
            .leftJoin('expense.details', 'details')
            .leftJoin('details.expenseType', 'expenseType');

        this.applyExpenseFilters(qb, filters);

        const rows = await qb
            .select('expenseType.id', 'expenseTypeId')
            .addSelect('expenseType.name', 'expenseType')
            .addSelect('COUNT(details.id)', 'count')
            .addSelect('SUM(details.amount)', 'total')
            .groupBy('expenseType.id')
            .addGroupBy('expenseType.name')
            .orderBy('total', 'DESC')
            .getRawMany();

        const grandTotal = rows.reduce((sum, row) => sum + Number(row.total), 0);

        return rows.map((row) => ({
            expenseTypeId: Number(row.expenseTypeId),
            expenseType: row.expenseType || 'Sin Categoría',
            count: Number(row.count),
            total: Number(row.total),
            percentage: grandTotal === 0 ? 0 : Number(((Number(row.total) * 100) / grandTotal).toFixed(2)),
        }));
    }

    async expenseByPaymentMethod(filters: ExpenseReportFilterDto) {
        const qb = this.expenseRepository
            .createQueryBuilder('expense')
            .leftJoin('expense.details', 'details')
            .leftJoin('details.paymentMethod', 'paymentMethod');

        this.applyExpenseFilters(qb, filters);

        const rows = await qb
            .select('paymentMethod.id', 'paymentMethodId')
            .addSelect('paymentMethod.name', 'paymentMethod')
            .addSelect('COUNT(details.id)', 'count')
            .addSelect('SUM(details.amount)', 'total')
            .groupBy('paymentMethod.id')
            .addGroupBy('paymentMethod.name')
            .orderBy('total', 'DESC')
            .getRawMany();

        const grandTotal = rows.reduce((sum, row) => sum + Number(row.total), 0);

        return rows.map((row) => ({
            paymentMethodId: Number(row.paymentMethodId),
            paymentMethod: row.paymentMethod || 'No especificado',
            count: Number(row.count),
            total: Number(row.total),
            percentage: grandTotal === 0 ? 0 : Number(((Number(row.total) * 100) / grandTotal).toFixed(2)),
        }));
    }

    async expenseBySupplier(filters: ExpenseReportFilterDto) {
        const qb = this.expenseRepository.createQueryBuilder('expense').leftJoin('expense.details', 'details');

        this.applyExpenseFilters(qb, filters);

        const rows = await qb
            .select('details.supplierOrBeneficiary', 'supplier')
            .addSelect('COUNT(details.id)', 'count')
            .addSelect('SUM(details.amount)', 'total')
            .addSelect('AVG(details.amount)', 'average')
            .addSelect('MIN(expense.expenseDate)', 'firstExpense')
            .addSelect('MAX(expense.expenseDate)', 'lastExpense')
            .groupBy('details.supplierOrBeneficiary')
            .orderBy('total', 'DESC')
            .getRawMany();

        return rows.map((row, index) => ({
            rank: index + 1,
            supplier: row.supplier,
            count: Number(row.count),
            total: Number(row.total),
            average: Number(Number(row.average).toFixed(2)),
            firstExpense: row.firstExpense,
            lastExpense: row.lastExpense,
        }));
    }

    private applyExpenseFilters(qb: SelectQueryBuilder<ExpenseEntity>, filters: ExpenseReportFilterDto) {
        if (filters.startDate) {
            qb.andWhere('expense.expenseDate >= :startDate', { startDate: filters.startDate });
        }

        if (filters.endDate) {
            qb.andWhere('expense.expenseDate <= :endDate', { endDate: filters.endDate });
        }

        if (filters.locationId) {
            qb.andWhere('expense.location.id = :locationId', { locationId: filters.locationId });
        }

        if (filters.ministryId) {
            qb.andWhere('expense.ministry.id = :ministryId', { ministryId: filters.ministryId });
        }

        if (filters.expenseTypeId) {
            qb.andWhere('details.expenseType.id = :expenseTypeId', { expenseTypeId: filters.expenseTypeId });
        }

        if (filters.paymentMethodId) {
            qb.andWhere('details.paymentMethod.id = :paymentMethodId', { paymentMethodId: filters.paymentMethodId });
        }

        if (filters.registeredById) {
            qb.andWhere('expense.registeredBy.id = :registeredById', { registeredById: filters.registeredById });
        }
    }
}
