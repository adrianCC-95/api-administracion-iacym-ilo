export interface IncomeByMemberResponse {
    rank: number;

    memberId: number;

    member: string;

    count: number;

    total: number;

    average: number;

    firstIncome: Date;

    lastIncome: Date;
}
