import { Injectable } from '@nestjs/common';
import { MembersService } from '../members/members.service';
import { ReportsService } from '../reports/reports.service';
import { MinistriesService } from '../ministries/ministries.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly reportsService: ReportsService,
        private readonly membersService: MembersService,
        private readonly usersService: UsersService,
        private readonly ministriesService: MinistriesService,
    ) {}

    async getDashboard() {
        const currentYear = new Date().getFullYear();

        const [
            incomeSummary,
            expenseSummary,
            expenseMonthly,
            incomeMonthly,
            memberRanking,
            totalMembers,
            totalMinistries,
            totalUsers,
            incomeByType,
            expenseByType,
            expenseByPaymentMethod,
            incomeByPaymentMethod,
        ] = await Promise.all([
            this.reportsService.incomeSummary({
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
            }),

            this.reportsService.expenseSummary({
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
            }),

            this.reportsService.expenseMonthly({
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
            }),

            this.reportsService.incomeMonthly({
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
            }),
            this.reportsService.incomeByMemberPaginated({
                page: 1,
                size: 5,
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
                sortField: 'total',
                sortDirection: 'DESC',
            }),
            this.membersService.count(),
            this.ministriesService.count(),
            this.usersService.count(),
            await this.reportsService.incomeByType({
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
            }),
            await this.reportsService.expenseByType({
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
            }),
            await this.reportsService.expenseByPaymentMethod({
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
            }),
            await this.reportsService.incomeByPaymentMethod({
                startDate: `${currentYear}-01-01`,
                endDate: `${currentYear}-12-31`,
            }),
        ]);

        return {
            cards: {
                incomes: incomeSummary.total,
                expenses: expenseSummary.total,
                members: totalMembers,
            },
            donuts: {
                incomeByType,
                expenseByType,
                expenseByPaymentMethod,
                incomeByPaymentMethod,
            },
            incomeMonthly,
            expenseMonthly,
            memberRanking,
            stats: {
                ministries: totalMinistries,
                users: totalUsers,
                members: totalMembers,
            },
        };
    }
}
