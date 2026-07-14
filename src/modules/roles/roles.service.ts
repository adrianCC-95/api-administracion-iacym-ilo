import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleRepositoryImpl } from './repositories/role.repository.impl';
import { FindRoleByCriteriaDto } from './dto/find-role-by-criteria';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { RoleMapper } from './mappers/role.mapper';
import { Role } from './models/role.model';

import { Response } from 'express';

import { AuthSession } from '../users/models/user.model';

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RoleRepositoryImpl) {}

    async findById(id: Role['id']) {
        const entity = await this.rolesRepository.findById(id);
        return entity ? RoleMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindRoleByCriteriaDto) {
        const entities = await this.rolesRepository.findByCriteria(criteria);
        return RoleMapper.toDomainList(entities);
    }

    async create(createRoleDto: CreateRoleDto) {
        const existingRole = await this.rolesRepository.findByName(createRoleDto.name);

        if (existingRole) throw new DuplicateException('role', createRoleDto.name);

        const newRole = await this.rolesRepository.create(createRoleDto);
        return RoleMapper.toDomain(newRole);
    }

    async update(id: Role['id'], updateRoleDto: UpdateRoleDto) {
        const updatedRole = await this.rolesRepository.update(id, updateRoleDto);
        return RoleMapper.toDomain(updatedRole);
    }

    async softDelete(id: Role['id']) {
        const role = await this.findById(id);

        if (!role) throw new DuplicateException('role', id);

        return await this.rolesRepository.softDelete(id);
    }

    async restore(id: Role['id']) {
        return await this.rolesRepository.restore(id);
    }
}
