import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LocationRepositoryImpl } from './location.repository.impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { CreateLocationDto } from '../dto/create-location.dto';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { FindLocationByyCriteriaDto } from '../dto/find-location-by-criteria.dto';
import { Location } from '../models/location.model';
import { Query } from '../../../utils/query';
import { PaginatedResult } from '../../../types/pagination';

@Injectable()
export class LocationRepository implements LocationRepositoryImpl {
    constructor(@InjectRepository(LocationEntity) private readonly locationRepository: Repository<LocationEntity>) {}

    async findById(id: Location['id']): Promise<LocationEntity | null> {
        try {
            return await this.locationRepository
                .createQueryBuilder('location')
                .where('location.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findByName(name: string): Promise<LocationEntity | null> {
        try {
            return await this.locationRepository
                .createQueryBuilder('location')
                .where('location.name = :name', { name })
                .withDeleted()
                .getOne();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findByCriteria(criteria: FindLocationByyCriteriaDto): Promise<PaginatedResult<LocationEntity>> {
        try {
            const qb = this.locationRepository.createQueryBuilder('location');

            if (criteria.name) {
                qb.andWhere('location.name LIKE :name', { name: `%${criteria.name}%` });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'location', criteria.status);
            }

            Query.sortCriteria(qb, `location.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(createLocationDto: CreateLocationDto): Promise<LocationEntity> {
        try {
            return await this.locationRepository.save(createLocationDto);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async update(id: Location['id'], updateLocationDto: UpdateLocationDto): Promise<LocationEntity> {
        try {
            const updated = await this.locationRepository.save({ id, ...updateLocationDto });
            return (await this.findById(updated.id)) as LocationEntity;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async softDelete(id: Location['id']): Promise<void> {
        try {
            await this.locationRepository.softDelete(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async restore(id: Location['id']): Promise<void> {
        try {
            await this.locationRepository.restore(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
