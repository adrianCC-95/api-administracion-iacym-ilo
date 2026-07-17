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
    constructor(@InjectRepository(IncomeTypeEntity) private readonly roleRepository: Repository<IncomeTypeEntity>) {}

    async findById(id: IncomeType['id']): Promise<IncomeTypeEntity | null> {
        try {
            return await this.roleRepository.createQueryBuilder('role').where('role.id = :id', { id }).getOne();
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async findByName(name: string): Promise<IncomeTypeEntity | null> {
        try {
            return await this.roleRepository
                .createQueryBuilder('role')
                .where('role.name = :name', { name })
                .withDeleted()
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async findByCriteria(criteria: FindIncomeTypeByCriteriaDto): Promise<PaginatedResult<IncomeTypeEntity>> {
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
            throw new CriticalInternalError(error);
        }
    }

    async create(createIncomeTypeDto: CreateIncomeTypeDto): Promise<IncomeTypeEntity> {
        try {
            return await this.roleRepository.save(createIncomeTypeDto);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async update(id: IncomeType['id'], updateIncomeTypeDto: UpdateIncomeTypeDto): Promise<IncomeTypeEntity> {
        try {
            const updated = await this.roleRepository.save({ id, ...updateIncomeTypeDto });
            return (await this.findById(updated.id)) as IncomeTypeEntity;
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async softDelete(id: IncomeType['id']): Promise<void> {
        try {
            await this.roleRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }
    async restore(id: IncomeType['id']): Promise<void> {
        try {
            await this.roleRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }
}
