export class ExpenseType {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class ExpenseTypeResponse {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    isDeleted: boolean;
}
