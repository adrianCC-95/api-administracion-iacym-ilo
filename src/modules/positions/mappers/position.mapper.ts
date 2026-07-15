import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';
import { PositionEntity } from '../entities/position.entity';
import { Position, PositionResponse } from '../models/position.model';

export class PositionMapper {
    static toDomain(entity: PositionEntity): Position {
        const position = new Position();

        position.id = entity.id;
        position.name = entity.name;
        position.description = entity.description;
        position.createdAt = entity.createdAt;
        position.updatedAt = entity.updatedAt;
        position.deletedAt = entity.deletedAt;

        return position;
    }

    static toDomainList(entities: PaginatedResult<PositionEntity>): PaginatedResult<Position> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(position: Position): PositionResponse {
        const response = new PositionResponse();

        response.id = position.id;
        response.name = position.name;
        response.description = position.description;
        response.createdAt = position.createdAt;
        response.isDeleted = position.deletedAt !== null;

        return response;
    }

    static toResponseList(list: PaginatedResult<Position>): PaginatedResult<PositionResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
