import { Injectable } from '@nestjs/common';
import { CreateIncomeTypeDto } from '../dto/create-income-type.dto';
import { IncomeTypeEntity } from '../entities/income-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncomeTypeRepositoryImpl } from './income-type.repository.impl';
import { FindIncomeTypeByCriteriaDto } from '../dto/find-income-type-by-criteria';
import { UpdateIncomeTypeDto } from '../dto/update-income-type.dto';
import { IncomeType } from '../models/income-type.model';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';

@Injectable()
export class IncomeTypeRepository implements IncomeTypeRepositoryImpl {
    constructor(
        @InjectRepository(IncomeTypeEntity) private readonly incomeTypeRepository: Repository<IncomeTypeEntity>,
    ) {}

    async findById(id: IncomeType['id']): Promise<IncomeTypeEntity | null> {
        try {
            return await this.incomeTypeRepository
                .createQueryBuilder('incomeType')
                .where('incomeType.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async findByName(name: string): Promise<IncomeTypeEntity | null> {
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

    async findByCriteria(criteria: FindIncomeTypeByCriteriaDto): Promise<PaginatedResult<IncomeTypeEntity>> {
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

    async create(createIncomeTypeDto: CreateIncomeTypeDto): Promise<IncomeTypeEntity> {
        try {
            return await this.incomeTypeRepository.save(createIncomeTypeDto);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async update(id: IncomeType['id'], updateIncomeTypeDto: UpdateIncomeTypeDto): Promise<IncomeTypeEntity> {
        try {
            const updated = await this.incomeTypeRepository.save({ id, ...updateIncomeTypeDto });
            return (await this.findById(updated.id)) as IncomeTypeEntity;
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async softDelete(id: IncomeType['id']): Promise<void> {
        try {
            await this.incomeTypeRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }
    async restore(id: IncomeType['id']): Promise<void> {
        try {
            await this.incomeTypeRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }
    async findByIdWithDeleted(id: IncomeType['id']) {
        return await this.incomeTypeRepository
            .createQueryBuilder('incomeType')
            .withDeleted()
            .where('incomeType.id = :id', { id })
            .getOne();
    }
}
