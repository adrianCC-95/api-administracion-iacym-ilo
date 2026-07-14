import { Role, RoleResponse } from '../models/role.model';
import { RoleEntity } from '../entities/role.entity';
import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';

export class RoleMapper {
    static toDomain(entity: RoleEntity): Role {
        const role = new Role();

        role.id = entity.id;
        role.name = entity.name;
        role.description = entity.description;
        role.createdAt = entity.createdAt;
        role.updatedAt = entity.updatedAt;
        role.deletedAt = entity.deletedAt;

        return role;
    }

    static toDomainList(entities: PaginatedResult<RoleEntity>): PaginatedResult<Role> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(role: Role): RoleResponse {
        const response = new RoleResponse();

        response.id = role.id;
        response.name = role.name;
        response.description = role.description;
        response.createdAt = role.createdAt;
        response.isDeleted = role.deletedAt !== null;

        return response;
    }

    static toResponseList(list: PaginatedResult<Role>): PaginatedResult<RoleResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
