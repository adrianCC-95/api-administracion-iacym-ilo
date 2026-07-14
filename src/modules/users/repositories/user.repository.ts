import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserRepositoryImpl } from './user.repository.impl';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUserByCriteriaDto } from '../dto/find-user-by-criteria.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../models/user.model';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';

@Injectable()
export class UserRepository implements UserRepositoryImpl {
    constructor(@InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>) {}

    async findById(id: User['id']): Promise<UserEntity | null> {
        try {
            return await this.usersRepository
                .createQueryBuilder('user')
                .innerJoinAndSelect('user.role', 'role')
                .leftJoinAndSelect('user.location', 'location')
                .where('user.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findByUsername(username: string): Promise<UserEntity | null> {
        try {
            return await this.usersRepository
                .createQueryBuilder('user')
                .where('user.username = :username', { username })
                .innerJoinAndSelect('user.role', 'role')
                .leftJoinAndSelect('user.location', 'location')
                .getOne();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findByCriteria(criteria: FindUserByCriteriaDto): Promise<PaginatedResult<UserEntity>> {
        try {
            const qb = this.usersRepository
                .createQueryBuilder('user')
                .innerJoinAndSelect('user.role', 'role')
                .leftJoinAndSelect('user.location', 'location');

            if (criteria.name) {
                qb.andWhere('user.name LIKE :name', { name: `%${criteria.name}%` });
            }

            if (criteria.username) {
                qb.andWhere('user.username LIKE :username', { username: `%${criteria.username}%` });
            }

            if (criteria.locationId) {
                qb.andWhere('location.id = :locationId', { locationId: criteria.locationId });
            }

            if (criteria.roleId) {
                qb.andWhere('role.id = :roleId', { roleId: criteria.roleId });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'user', criteria.status);
            }

            Query.sortCriteria(qb, `user.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(createUserDto: CreateUserDto): Promise<UserEntity> {
        try {
            const { roleId, locationId, ...rest } = createUserDto;
            const created = await this.usersRepository.save({
                ...rest,
                role: { id: roleId },
                ...(locationId ? { location: { id: locationId } } : {}),
            });

            return (await this.findById(created.id)) as UserEntity;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async update(id: User['id'], updateUserDto: UpdateUserDto): Promise<UserEntity> {
        try {
            const { roleId, locationId, ...rest } = updateUserDto;
            const updated = await this.usersRepository.save({
                id,
                ...rest,
                ...(roleId ? { role: { id: roleId } } : {}),
                ...(locationId ? { location: { id: locationId } } : {}),
            });

            return (await this.findById(updated.id)) as UserEntity;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async softDelete(id: User['id']): Promise<void> {
        try {
            await this.usersRepository.softDelete(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
    async restore(id: User['id']): Promise<void> {
        try {
            await this.usersRepository.restore(id);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
