import { UserEntity } from '../entities/user.entity';
import { User, UserResponse } from '../models/user.model';
import { RoleMapper } from '../../roles/mappers/role.mapper';
import { LocationMapper } from '../../locations/mappers/location.mapper';
import { mapPaginated } from '../../../utils/pagination';
import { PaginatedResult } from '../../../types/pagination';
import { RoleResponse } from '../../roles/models/role.model';
import { LocationResponse } from '../../locations/models/location.model';

export class UserMapper {
    static toDomain(entity: UserEntity): User {
        const user = new User();

        user.id = entity.id;
        user.name = entity.name;
        // user.password = entity.password;
        user.username = entity.username;
        user.role = RoleMapper.toDomain(entity.role);
        user.location = entity.location ? LocationMapper.toDomain(entity.location) : null;
        user.createdAt = entity.createdAt;
        user.updatedAt = entity.updatedAt;
        user.deletedAt = entity.deletedAt;

        return user;
    }

    static toDomainList(entities: PaginatedResult<UserEntity>): PaginatedResult<User> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(user: User): UserResponse {
        const response = new UserResponse();

        response.id = user.id;
        response.name = user.name;
        response.username = user.username;

        if (user.role) {
            response.role = new RoleResponse();
            response.role.id = user.role.id;
            response.role.name = user.role.name;
        }

        if (user.location) {
            response.location = new LocationResponse();
            response.location.id = user.location.id;
            response.location.name = user.location.name;
        }

        response.createdAt = user.createdAt;
        response.isDeleted = user.deletedAt !== null;

        return response;
    }
    static toResponseList(list: PaginatedResult<User>): PaginatedResult<UserResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
