import { PaymentMethod, PaymentMethodResponse } from '../models/payment-method.model';
import { PaymentMethodEntity } from '../entities/payment-method.entity';
import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';

export class PaymentMethodMapper {
    static toDomain(entity: PaymentMethodEntity): PaymentMethod {
        const paymentMethod = new PaymentMethod();

        paymentMethod.id = entity.id;
        paymentMethod.name = entity.name;
        paymentMethod.description = entity.description || null;
        paymentMethod.createdAt = entity.createdAt;
        paymentMethod.updatedAt = entity.updatedAt;
        paymentMethod.deletedAt = entity.deletedAt || null;

        return paymentMethod;
    }

    static toDomainList(entities: PaginatedResult<PaymentMethodEntity>): PaginatedResult<PaymentMethod> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(paymentMethod: PaymentMethod): PaymentMethodResponse {
        const response = new PaymentMethodResponse();

        response.id = paymentMethod.id;
        response.name = paymentMethod.name;
        response.description = paymentMethod.description;
        response.createdAt = paymentMethod.createdAt;
        response.isDeleted = paymentMethod.deletedAt !== null;

        return response;
    }

    static toResponseList(list: PaginatedResult<PaymentMethod>): PaginatedResult<PaymentMethodResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
