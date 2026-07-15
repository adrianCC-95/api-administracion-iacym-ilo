import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';
import { MinistryEntity } from '../entities/ministry.entity';
import { Ministry, MinistryResponse } from '../models/ministry.model';

export class MinistryMapper {
    static toDomain(entity: MinistryEntity): Ministry {
        const ministry = new Ministry();

        ministry.id = entity.id;
        ministry.name = entity.name;
        ministry.description = entity.description;
        ministry.createdAt = entity.createdAt;
        ministry.updatedAt = entity.updatedAt;
        ministry.deletedAt = entity.deletedAt;

        return ministry;
    }

    static toDomainList(entities: PaginatedResult<MinistryEntity>): PaginatedResult<Ministry> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(ministry: Ministry): MinistryResponse {
        const response = new MinistryResponse();

        response.id = ministry.id;
        response.name = ministry.name;
        response.description = ministry.description;
        response.createdAt = ministry.createdAt;
        response.isDeleted = ministry.deletedAt !== null;

        return response;
    }

    static toResponseList(list: PaginatedResult<Ministry>): PaginatedResult<MinistryResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
