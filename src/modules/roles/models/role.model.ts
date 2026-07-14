export class Role {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class RoleResponse {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    isDeleted: boolean;
}
