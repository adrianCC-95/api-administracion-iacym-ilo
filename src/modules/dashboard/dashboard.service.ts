import { Injectable } from '@nestjs/common';
import { MembersService } from '../members/members.service';
import { ReportsService } from '../reports/reports.service';

@Injectable()
export class DashboardService {
    constructor(
        private readonly reportsService: ReportsService,
        private readonly membersService: MembersService,
    ) {}

    async getDashboard() {
        const currentYear = new Date().getFullYear();

        const [incomeSummary, expenseSummary, expenseMonthly, incomeMonthly, memberRanking, totalMembers] =
            await Promise.all([
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
            ]);

        return {
            cards: {
                incomes: incomeSummary.total,
                expenses: expenseSummary.total,
                members: totalMembers,
            },
            incomeMonthly,
            expenseMonthly,
            memberRanking,
            stats: {
                ministries: 10,
                users: 20,
                members: totalMembers,
            },
        };
    }
}
