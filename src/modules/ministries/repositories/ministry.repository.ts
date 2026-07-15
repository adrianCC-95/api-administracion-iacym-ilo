import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';
import { MinistryRepositoryImpl } from './ministry.repository.impl';
import { MinistryEntity } from '../entities/ministry.entity';
import { Ministry } from '../models/ministry.model';
import { FindMinistryByCriteriaDto } from '../dto/find-ministry-by-criteria';
import { CreateMinistryDto } from '../dto/create-ministry.dto';
import { UpdateMinistryDto } from '../dto/update-ministry.dto';

@Injectable()
export class MinistryRepository implements MinistryRepositoryImpl {
    constructor(@InjectRepository(MinistryEntity) private readonly ministryRepository: Repository<MinistryEntity>) {}

    async findById(id: Ministry['id']): Promise<MinistryEntity | null> {
        try {
            return await this.ministryRepository
                .createQueryBuilder('ministry')
                .where('ministry.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByName(name: string): Promise<MinistryEntity | null> {
        try {
            return await this.ministryRepository
                .createQueryBuilder('ministry')
                .where('ministry.name = :name', { name })
                .withDeleted()
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByCriteria(criteria: FindMinistryByCriteriaDto): Promise<PaginatedResult<MinistryEntity>> {
        try {
            const qb = this.ministryRepository.createQueryBuilder('ministry');

            if (criteria.name) {
                qb.andWhere('ministry.name LIKE :name', { name: `%${criteria.name}%` });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'ministry', criteria.status);
            }
            Query.sortCriteria(qb, `ministry.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async create(createMinistryDto: CreateMinistryDto): Promise<MinistryEntity> {
        try {
            return await this.ministryRepository.save(createMinistryDto);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async update(id: Ministry['id'], updateMinistryDto: UpdateMinistryDto): Promise<MinistryEntity> {
        try {
            const updated = await this.ministryRepository.save({ id, ...updateMinistryDto });
            return (await this.findById(updated.id)) as MinistryEntity;
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async softDelete(id: Ministry['id']): Promise<void> {
        try {
            await this.ministryRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
    async restore(id: Ministry['id']): Promise<void> {
        try {
            await this.ministryRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
}
