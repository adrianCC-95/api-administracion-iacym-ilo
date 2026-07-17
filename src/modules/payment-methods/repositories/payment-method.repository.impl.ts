import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { PaymentMethodEntity } from '../entities/payment-method.entity';
import { FindPaymentMethodByCriteriaDto } from '../dto/find-payment-method-by-criteria';
import { UpdatePaymentMethodDto } from '../dto/update-payment-method.dto';
import { PaymentMethod } from '../models/payment-method.model';
import { PaginatedResult } from '../../../types/pagination';

export abstract class PaymentMethodRepositoryImpl {
    abstract create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethodEntity>;
    abstract findById(id: PaymentMethod['id']): Promise<PaymentMethodEntity | null>;
    abstract findByName(name: string): Promise<PaymentMethodEntity | null>;
    abstract findByCriteria(criteria: FindPaymentMethodByCriteriaDto): Promise<PaginatedResult<PaymentMethodEntity>>;
    abstract update(
        id: PaymentMethod['id'],
        updatePaymentMethodDto: UpdatePaymentMethodDto,
    ): Promise<PaymentMethodEntity>;
    abstract softDelete(id: PaymentMethod['id']): Promise<void>;
    abstract restore(id: PaymentMethod['id']): Promise<void>;
}
