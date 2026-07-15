import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionRepositoryImpl } from './repositories/position.repository.impl';
import { FindPositionByCriteriaDto } from './dto/find-position-by-criteria';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { PositionMapper } from './mappers/position.mapper';
import { Position } from './models/position.model';

@Injectable()
export class PositionsService {
    constructor(private readonly positionRepository: PositionRepositoryImpl) {}

    async findById(id: Position['id']) {
        const entity = await this.positionRepository.findById(id);
        return entity ? PositionMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindPositionByCriteriaDto) {
        const entities = await this.positionRepository.findByCriteria(criteria);
        return PositionMapper.toDomainList(entities);
    }

    async create(createPositionDto: CreatePositionDto) {
        const existing = await this.positionRepository.findByName(createPositionDto.name);

        if (existing) {
            throw new DuplicateException('Position', createPositionDto.name);
        }

        const entity = await this.positionRepository.create(createPositionDto);
        return PositionMapper.toDomain(entity);
    }

    async update(id: Position['id'], updatePositionDto: UpdatePositionDto) {
        const entity = await this.positionRepository.update(id, updatePositionDto);
        return PositionMapper.toDomain(entity);
    }

    async softDelete(id: Position['id']) {
        const position = await this.findById(id);

        if (!position) {
            throw new DuplicateException('Position', id);
        }

        return this.positionRepository.softDelete(id);
    }

    async restore(id: Position['id']) {
        return this.positionRepository.restore(id);
    }
}
