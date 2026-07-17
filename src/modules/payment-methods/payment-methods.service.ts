import { Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodRepositoryImpl } from './repositories/payment-method.repository.impl';
import { FindPaymentMethodByCriteriaDto } from './dto/find-payment-method-by-criteria';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { PaymentMethodMapper } from './mappers/payment-method.mapper';
import { PaymentMethod } from './models/payment-method.model';

@Injectable()
export class PaymentMethodsService {
    constructor(private readonly rolesRepository: PaymentMethodRepositoryImpl) {}

    async findById(id: PaymentMethod['id']) {
        const entity = await this.rolesRepository.findById(id);
        return entity ? PaymentMethodMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindPaymentMethodByCriteriaDto) {
        const entities = await this.rolesRepository.findByCriteria(criteria);
        return PaymentMethodMapper.toDomainList(entities);
    }

    async create(createPaymentMethodDto: CreatePaymentMethodDto) {
        const existingPaymentMethod = await this.rolesRepository.findByName(createPaymentMethodDto.name);

        if (existingPaymentMethod) throw new DuplicateException('role', createPaymentMethodDto.name);

        const newPaymentMethod = await this.rolesRepository.create(createPaymentMethodDto);
        return PaymentMethodMapper.toDomain(newPaymentMethod);
    }

    async update(id: PaymentMethod['id'], updatePaymentMethodDto: UpdatePaymentMethodDto) {
        const updatedPaymentMethod = await this.rolesRepository.update(id, updatePaymentMethodDto);
        return PaymentMethodMapper.toDomain(updatedPaymentMethod);
    }

    async softDelete(id: PaymentMethod['id']) {
        const role = await this.findById(id);

        if (!role) throw new DuplicateException('role', id);

        return await this.rolesRepository.softDelete(id);
    }

    async restore(id: PaymentMethod['id']) {
        return await this.rolesRepository.restore(id);
    }
}
