import { PaginatedResult } from '../../../types/pagination';
import { CreatePositionDto } from '../dto/create-position.dto';
import { FindPositionByCriteriaDto } from '../dto/find-position-by-criteria';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { PositionEntity } from '../entities/position.entity';
import { Position } from '../models/position.model';

export abstract class PositionRepositoryImpl {
    abstract create(createPositionDto: CreatePositionDto): Promise<PositionEntity>;

    abstract findById(id: Position['id']): Promise<PositionEntity | null>;

    abstract findByName(name: string): Promise<PositionEntity | null>;

    abstract findByCriteria(criteria: FindPositionByCriteriaDto): Promise<PaginatedResult<PositionEntity>>;

    abstract update(id: Position['id'], updatePositionDto: UpdatePositionDto): Promise<PositionEntity>;

    abstract softDelete(id: Position['id']): Promise<void>;

    abstract restore(id: Position['id']): Promise<void>;
}
