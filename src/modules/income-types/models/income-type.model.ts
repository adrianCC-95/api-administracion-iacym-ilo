export class IncomeType {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class IncomeTypeResponse {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    isDeleted: boolean;
}
