import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { RoleEntity } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleRepositoryImpl } from './role.repository.impl';
import { FindRoleByCriteriaDto } from '../dto/find-role-by-criteria';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { Role } from '../models/role.model';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';

@Injectable()
export class RoleRepository implements RoleRepositoryImpl {
    constructor(@InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>) {}

    async findById(id: Role['id']): Promise<RoleEntity | null> {
        try {
            return await this.roleRepository.createQueryBuilder('role').where('role.id = :id', { id }).getOne();
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async findByName(name: string): Promise<RoleEntity | null> {
        try {
            return await this.roleRepository
                .createQueryBuilder('role')
                .where('role.name = :name', { name })
                .withDeleted()
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async findByCriteria(criteria: FindRoleByCriteriaDto): Promise<PaginatedResult<RoleEntity>> {
        try {
            const qb = this.roleRepository.createQueryBuilder('role');

            if (criteria.name) {
                qb.andWhere('role.name LIKE :name', { name: `%${criteria.name}%` });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'role', criteria.status);
            }
            Query.sortCriteria(qb, `role.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async create(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
        try {
            return await this.roleRepository.save(createRoleDto);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async update(id: Role['id'], updateRoleDto: UpdateRoleDto): Promise<RoleEntity> {
        try {
            const updated = await this.roleRepository.save({ id, ...updateRoleDto });
            return (await this.findById(updated.id)) as RoleEntity;
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }

    async softDelete(id: Role['id']): Promise<void> {
        try {
            await this.roleRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }
    async restore(id: Role['id']): Promise<void> {
        try {
            await this.roleRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error);
        }
    }
}
