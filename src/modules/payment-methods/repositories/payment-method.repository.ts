import { Injectable } from '@nestjs/common';
import { CreatePaymentMethodDto } from '../dto/create-payment-method.dto';
import { PaymentMethodEntity } from '../entities/payment-method.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentMethodRepositoryImpl } from './payment-method.repository.impl';
import { FindPaymentMethodByCriteriaDto } from '../dto/find-payment-method-by-criteria';
import { UpdatePaymentMethodDto } from '../dto/update-payment-method.dto';
import { PaymentMethod } from '../models/payment-method.model';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';

@Injectable()
export class PaymentMethodRepository implements PaymentMethodRepositoryImpl {
    constructor(
        @InjectRepository(PaymentMethodEntity) private readonly roleRepository: Repository<PaymentMethodEntity>,
    ) {}

    async findById(id: PaymentMethod['id']): Promise<PaymentMethodEntity | null> {
        try {
            return await this.roleRepository.createQueryBuilder('role').where('role.id = :id', { id }).getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByName(name: string): Promise<PaymentMethodEntity | null> {
        try {
            return await this.roleRepository
                .createQueryBuilder('role')
                .where('role.name = :name', { name })
                .withDeleted()
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByCriteria(criteria: FindPaymentMethodByCriteriaDto): Promise<PaginatedResult<PaymentMethodEntity>> {
        try {
            const qb = this.roleRepository.createQueryBuilder('role');

            if (criteria.name) {
                qb.andWhere('role.name LIKE :name', { name: `%${criteria.name}%` });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'role', criteria.status);
            }
            Query.sortCriteria(qb, `role.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async create(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethodEntity> {
        try {
            return await this.roleRepository.save(createPaymentMethodDto);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async update(
        id: PaymentMethod['id'],
        updatePaymentMethodDto: UpdatePaymentMethodDto,
    ): Promise<PaymentMethodEntity> {
        try {
            const updated = await this.roleRepository.save({ id, ...updatePaymentMethodDto });
            return (await this.findById(updated.id)) as PaymentMethodEntity;
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async softDelete(id: PaymentMethod['id']): Promise<void> {
        try {
            await this.roleRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
    async restore(id: PaymentMethod['id']): Promise<void> {
        try {
            await this.roleRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
}
