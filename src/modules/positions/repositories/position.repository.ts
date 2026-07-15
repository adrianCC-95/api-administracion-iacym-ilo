import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';

import { PositionRepositoryImpl } from './position.repository.impl';
import { PositionEntity } from '../entities/position.entity';
import { Position } from '../models/position.model';
import { FindPositionByCriteriaDto } from '../dto/find-position-by-criteria';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';

@Injectable()
export class PositionRepository implements PositionRepositoryImpl {
    constructor(
        @InjectRepository(PositionEntity)
        private readonly positionRepository: Repository<PositionEntity>,
    ) {}

    async findById(id: Position['id']): Promise<PositionEntity | null> {
        try {
            return await this.positionRepository
                .createQueryBuilder('position')
                .where('position.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByName(name: string): Promise<PositionEntity | null> {
        try {
            return await this.positionRepository
                .createQueryBuilder('position')
                .where('position.name = :name', { name })
                .withDeleted()
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByCriteria(criteria: FindPositionByCriteriaDto): Promise<PaginatedResult<PositionEntity>> {
        try {
            const qb = this.positionRepository.createQueryBuilder('position');

            if (criteria.name) {
                qb.andWhere('position.name LIKE :name', {
                    name: `%${criteria.name}%`,
                });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'position', criteria.status);
            }

            Query.sortCriteria(qb, `position.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async create(createPositionDto: CreatePositionDto): Promise<PositionEntity> {
        try {
            return await this.positionRepository.save(createPositionDto);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async update(id: Position['id'], updatePositionDto: UpdatePositionDto): Promise<PositionEntity> {
        try {
            const updated = await this.positionRepository.save({
                id,
                ...updatePositionDto,
            });

            return (await this.findById(updated.id)) as PositionEntity;
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async softDelete(id: Position['id']): Promise<void> {
        try {
            await this.positionRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async restore(id: Position['id']): Promise<void> {
        try {
            await this.positionRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
}
