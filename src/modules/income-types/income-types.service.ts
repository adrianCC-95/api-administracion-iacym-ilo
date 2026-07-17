import { Injectable } from '@nestjs/common';
import { CreateIncomeTypeDto } from './dto/create-income-type.dto';
import { UpdateIncomeTypeDto } from './dto/update-income-type.dto';
import { IncomeTypeRepositoryImpl } from './repositories/income-type.repository.impl';
import { FindIncomeTypeByCriteriaDto } from './dto/find-income-type-by-criteria';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { IncomeTypeMapper } from './mappers/income-type.mapper';
import { IncomeType } from './models/income-type.model';

@Injectable()
export class IncomeTypesService {
    constructor(private readonly incomeTypesRepository: IncomeTypeRepositoryImpl) {}

    async findById(id: IncomeType['id']) {
        const entity = await this.incomeTypesRepository.findById(id);
        return entity ? IncomeTypeMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindIncomeTypeByCriteriaDto) {
        const entities = await this.incomeTypesRepository.findByCriteria(criteria);
        return IncomeTypeMapper.toDomainList(entities);
    }

    async create(createIncomeTypeDto: CreateIncomeTypeDto) {
        const existingIncomeType = await this.incomeTypesRepository.findByName(createIncomeTypeDto.name);

        if (existingIncomeType) throw new DuplicateException('role', createIncomeTypeDto.name);

        const newIncomeType = await this.incomeTypesRepository.create(createIncomeTypeDto);
        return IncomeTypeMapper.toDomain(newIncomeType);
    }

    async update(id: IncomeType['id'], updateIncomeTypeDto: UpdateIncomeTypeDto) {
        const updatedIncomeType = await this.incomeTypesRepository.update(id, updateIncomeTypeDto);
        return IncomeTypeMapper.toDomain(updatedIncomeType);
    }

    async softDelete(id: IncomeType['id']) {
        const role = await this.findById(id);

        if (!role) throw new DuplicateException('role', id);

        return await this.incomeTypesRepository.softDelete(id);
    }

    async restore(id: IncomeType['id']) {
        return await this.incomeTypesRepository.restore(id);
    }

    async findByIdWithDeleted(id: IncomeType['id']) {
        const entity = await this.incomeTypesRepository.findByIdWithDeleted(id);

        return entity ? IncomeTypeMapper.toDomain(entity) : null;
    }
}
