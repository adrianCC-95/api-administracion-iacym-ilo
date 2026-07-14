export class Location {
    id: number;
    name: string;
    description: string | null;
    address: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class LocationResponse {
    id: number;
    name: string;
    description: string | null;
    address: string | null;
    createdAt: Date;
    isDeleted: boolean;
}
