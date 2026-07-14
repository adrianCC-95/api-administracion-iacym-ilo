import { Injectable } from '@nestjs/common';
import { LocationRepositoryImpl } from './repositories/location.repository.impl';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { FindLocationByyCriteriaDto } from './dto/find-location-by-criteria.dto';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { LocationMapper } from './mappers/location.mapper';

@Injectable()
export class LocationsService {
    constructor(private readonly locationRepository: LocationRepositoryImpl) {}

    async findById(id: number) {
        const entity = await this.locationRepository.findById(id);
        return entity ? LocationMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindLocationByyCriteriaDto) {
        const entities = await this.locationRepository.findByCriteria(criteria);
        return LocationMapper.toDomainList(entities);
    }

    async create(createLocationDto: CreateLocationDto) {
        const location = await this.locationRepository.findByName(createLocationDto.name);

        if (location) throw new DuplicateException('location', createLocationDto.name);

        const newLocation = await this.locationRepository.create(createLocationDto);
        return LocationMapper.toDomain(newLocation);
    }

    async update(id: number, updateLocationDto: UpdateLocationDto) {
        if (updateLocationDto.name) {
            const location = await this.locationRepository.findByName(updateLocationDto.name);

            if (location) throw new DuplicateException('location', updateLocationDto.name);
        }

        const updatedLocation = await this.locationRepository.update(id, updateLocationDto);
        return LocationMapper.toDomain(updatedLocation);
    }

    async softDelete(id: number) {
        const location = await this.findById(id);

        if (!location) throw new ResourceNotFoundException('location', id);

        return await this.locationRepository.softDelete(id);
    }

    async restore(id: number) {
        return await this.locationRepository.restore(id);
    }
}
