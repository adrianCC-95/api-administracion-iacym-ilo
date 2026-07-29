import { Injectable } from '@nestjs/common';
import { MembersService } from '../members/members.service';
import { ReportsService } from '../reports/reports.service';
import { MinistriesService } from '../ministries/ministries.service';
import { UsersService } from '../users/users.service';
import { GetDashboardQueryDto } from './dto/get-dashboard-query.dto';

@Injectable()
export class DashboardService {
    constructor(
        private readonly reportsService: ReportsService,
        private readonly membersService: MembersService,
        private readonly usersService: UsersService,
        private readonly ministriesService: MinistriesService,
    ) {}

    async getDashboard(queryDto: GetDashboardQueryDto) {
        const startDate = queryDto.startDate ?? this.getDefaultStartDate();
        const endDate = queryDto.endDate ?? this.getDefaultEndDate();
        const dateRange = { startDate, endDate };

        const currentYear = new Date().getFullYear();
        const yearRange = {
            startDate: `${currentYear}-01-01`,
            endDate: `${currentYear}-12-31`,
        };

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
            incomeDaily,
            expenseDaily,
        ] = await Promise.all([
            this.reportsService.incomeSummary(dateRange),
            this.reportsService.expenseSummary(dateRange),

            this.reportsService.expenseMonthly(yearRange),
            this.reportsService.incomeMonthly(yearRange),

            this.reportsService.incomeByMemberPaginated({
                page: 1,
                size: 5,
                ...dateRange,
                sortField: 'total',
                sortDirection: 'DESC',
            }),
            this.membersService.count(),
            this.ministriesService.count(),
            this.usersService.count(),
            this.reportsService.incomeByType(dateRange),
            this.reportsService.expenseByType(dateRange),
            this.reportsService.expenseByPaymentMethod(dateRange),
            this.reportsService.incomeByPaymentMethod(dateRange),
            this.reportsService.incomeDaily(dateRange),
            this.reportsService.expenseDaily(dateRange),
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
            incomeDaily,
            expenseDaily,
        };
    }

    private getDefaultStartDate(): string {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${year}-${month}-01`;
    }

    private getDefaultEndDate(): string {
        const date = new Date();
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        const year = lastDay.getFullYear();
        const month = String(lastDay.getMonth() + 1).padStart(2, '0');
        const day = String(lastDay.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
