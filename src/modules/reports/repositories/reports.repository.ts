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

@Injectable()
export class ReportsRepository implements ReportsRepositoryImpl {
    constructor(
        @InjectRepository(IncomeEntity)
        private readonly repository: Repository<IncomeEntity>,
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
        console.log('fechas', filters.startDate, filters.endDate);
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
        console.log('filtros desde repositorio', filters);
        const qb = this.repository
            .createQueryBuilder('income')
            .leftJoin('income.member', 'member')
            .leftJoin('income.incomeType', 'incomeType')
            .leftJoin('income.paymentMethod', 'paymentMethod')
            .leftJoin('income.registeredBy', 'registeredBy');

        this.applyFilters(qb, filters);
        console.log('filtros', qb);

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

        console.log('filtros desde repositorio', qb.getOne());

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
}
