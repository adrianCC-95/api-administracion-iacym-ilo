import { LocationEntity } from '../entities/location.entity';
import { Location, LocationResponse } from '../models/location.model';
import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';

export class LocationMapper {
    static toDomain(entity: LocationEntity): Location {
        const location = new Location();

        location.id = entity.id;
        location.name = entity.name;
        location.description = entity.description;
        location.address = entity.address;
        location.createdAt = entity.createdAt;
        location.updatedAt = entity.updatedAt;
        location.deletedAt = entity.deletedAt;

        return location;
    }

    static toDomainList(entities: PaginatedResult<LocationEntity>): PaginatedResult<Location> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(location: Location): LocationResponse {
        const response = new LocationResponse();
        response.id = location.id;
        response.name = location.name;
        response.description = location.description;
        response.address = location.address;
        response.createdAt = location.createdAt;
        response.isDeleted = location.deletedAt !== null;

        return response;
    }

    static toResponseList(list: PaginatedResult<Location>): PaginatedResult<LocationResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
