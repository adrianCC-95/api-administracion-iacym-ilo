export class PaymentMethod {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class PaymentMethodResponse {
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    isDeleted: boolean;
}
