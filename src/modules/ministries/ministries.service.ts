import { Injectable } from '@nestjs/common';
import { CreateMinistryDto } from './dto/create-ministry.dto';
import { UpdateMinistryDto } from './dto/update-ministry.dto';
import { MinistryRepositoryImpl } from './repositories/ministry.repository.impl';
import { FindMinistryByCriteriaDto } from './dto/find-ministry-by-criteria';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { MinistryMapper } from './mappers/ministry.mapper';
import { Ministry } from './models/ministry.model';

@Injectable()
export class MinistriesService {
    constructor(private readonly ministryRepository: MinistryRepositoryImpl) {}

    async findById(id: Ministry['id']) {
        const entity = await this.ministryRepository.findById(id);
        return entity ? MinistryMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindMinistryByCriteriaDto) {
        const entities = await this.ministryRepository.findByCriteria(criteria);
        return MinistryMapper.toDomainList(entities);
    }

    async create(createMinistryDto: CreateMinistryDto) {
        const existingMinistry = await this.ministryRepository.findByName(createMinistryDto.name);

        if (existingMinistry) throw new DuplicateException('Ministry', createMinistryDto.name);

        const newMinistry = await this.ministryRepository.create(createMinistryDto);
        return MinistryMapper.toDomain(newMinistry);
    }

    async update(id: Ministry['id'], updateMinistryDto: UpdateMinistryDto) {
        const updatedMinistry = await this.ministryRepository.update(id, updateMinistryDto);
        return MinistryMapper.toDomain(updatedMinistry);
    }

    async softDelete(id: Ministry['id']) {
        const Ministry = await this.findById(id);

        if (!Ministry) throw new DuplicateException('Ministry', id);

        return await this.ministryRepository.softDelete(id);
    }

    async restore(id: Ministry['id']) {
        return await this.ministryRepository.restore(id);
    }
}
