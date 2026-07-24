import { Injectable } from '@nestjs/common';
import { CreateExpenseTypeDto } from '../dto/create-expense-type.dto';
import { ExpenseTypeEntity } from '../entities/expense-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseTypeRepositoryImpl } from './expense-type.repository.impl';
import { FindExpenseTypeByCriteriaDto } from '../dto/find-expense-type-by-criteria';
import { UpdateExpenseTypeDto } from '../dto/update-expense-type.dto';
import { ExpenseType } from '../models/expense-type.model';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';

@Injectable()
export class ExpenseTypeRepository implements ExpenseTypeRepositoryImpl {
    constructor(
        @InjectRepository(ExpenseTypeEntity) private readonly incomeTypeRepository: Repository<ExpenseTypeEntity>,
    ) {}

    async findById(id: ExpenseType['id']): Promise<ExpenseTypeEntity | null> {
        try {
            return await this.incomeTypeRepository
                .createQueryBuilder('incomeType')
                .where('incomeType.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async findByName(name: string): Promise<ExpenseTypeEntity | null> {
        try {
            return await this.incomeTypeRepository
                .createQueryBuilder('incomeType')
                .where('incomeType.name = :name', { name })
                .withDeleted()
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async findByCriteria(criteria: FindExpenseTypeByCriteriaDto): Promise<PaginatedResult<ExpenseTypeEntity>> {
        try {
            const qb = this.incomeTypeRepository.createQueryBuilder('incomeType');

            if (criteria.name) {
                qb.andWhere('incomeType.name LIKE :name', { name: `%${criteria.name}%` });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'incomeType', criteria.status);
            }
            Query.sortCriteria(qb, `incomeType.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async create(createExpenseTypeDto: CreateExpenseTypeDto): Promise<ExpenseTypeEntity> {
        try {
            return await this.incomeTypeRepository.save(createExpenseTypeDto);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async update(id: ExpenseType['id'], updateExpenseTypeDto: UpdateExpenseTypeDto): Promise<ExpenseTypeEntity> {
        try {
            const updated = await this.incomeTypeRepository.save({ id, ...updateExpenseTypeDto });
            return (await this.findById(updated.id)) as ExpenseTypeEntity;
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async softDelete(id: ExpenseType['id']): Promise<void> {
        try {
            await this.incomeTypeRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }
    async restore(id: ExpenseType['id']): Promise<void> {
        try {
            await this.incomeTypeRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }
    async findByIdWithDeleted(id: ExpenseType['id']) {
        return await this.incomeTypeRepository
            .createQueryBuilder('incomeType')
            .withDeleted()
            .where('incomeType.id = :id', { id })
            .getOne();
    }
}
