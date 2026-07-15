export class Ministry {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class MinistryResponse {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    isDeleted: boolean;
}
