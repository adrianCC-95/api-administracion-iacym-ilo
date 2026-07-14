import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleEntity } from '../entities/role.entity';
import { FindRoleByCriteriaDto } from '../dto/find-role-by-criteria';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../models/role.model';
import { PaginatedResult } from '../../../types/pagination';

export abstract class RoleRepositoryImpl {
    abstract create(createRoleDto: CreateRoleDto): Promise<RoleEntity>;
    abstract findById(id: Role['id']): Promise<RoleEntity | null>;
    abstract findByName(name: string): Promise<RoleEntity | null>;
    abstract findByCriteria(criteria: FindRoleByCriteriaDto): Promise<PaginatedResult<RoleEntity>>;
    abstract update(id: Role['id'], updateRoleDto: UpdateRoleDto): Promise<RoleEntity>;
    abstract softDelete(id: Role['id']): Promise<void>;
    abstract restore(id: Role['id']): Promise<void>;
}
