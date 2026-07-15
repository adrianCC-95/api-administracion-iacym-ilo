export class Position {
    id: number;
    name: string;
    description: string | null;

    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class PositionResponse {
    id: number;
    name: string;
    description: string | null;

    createdAt: Date;
    isDeleted: boolean;
}
