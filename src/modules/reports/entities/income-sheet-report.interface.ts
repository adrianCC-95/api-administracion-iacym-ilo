export interface TitheItem {
    memberName: string;
    amount: number;
}

export interface SummaryCategory {
    id: number;
    name: string;
    total: number;
}

export interface IncomeSheetData {
    date: string;
    tithes: TitheItem[];
    summary: {
        categories: SummaryCategory[];
        totalDiezmos: number;
        grandTotal: number;
    };
}
