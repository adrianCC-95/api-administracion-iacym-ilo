import { IncomeByMemberResponse } from '../responses/income-by-member.response';

export class ReportMapper {
    static toIncomeByMember(row: any, rank: number): IncomeByMemberResponse {
        return {
            rank,

            memberId: Number(row.memberId),

            member: row.member,

            count: Number(row.count),

            total: Number(row.total),

            average: Number(Number(row.average).toFixed(2)),

            firstIncome: row.firstIncome,

            lastIncome: row.lastIncome,
        };
    }
}
