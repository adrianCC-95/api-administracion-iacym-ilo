import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepositoryImpl } from './repositories/user.repository.impl';
import { encryptPassword } from '../../utils/credentials';
import { FindUserByCriteriaDto } from './dto/find-user-by-criteria.dto';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RolesService } from '../roles/roles.service';
import { LocationsService } from '../locations/locations.service';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UserRepositoryImpl,
        private readonly rolesService: RolesService,
        private readonly locationsService: LocationsService,
    ) {}

    async findById(id: number) {
        const user = await this.usersRepository.findById(id);
        return user ? UserMapper.toDomain(user) : null;
    }

    async findByUsername(username: string) {
        const user = await this.usersRepository.findByUsername(username);
        return user ? UserMapper.toDomain(user) : null;
    }

    async findByCriteria(criteria: FindUserByCriteriaDto) {
        const users = await this.usersRepository.findByCriteria(criteria);
        return UserMapper.toDomainList(users);
    }

    async create(createUserDto: CreateUserDto) {
        const user = await this.findByUsername(createUserDto.username);

        if (user) throw new DuplicateException('user', createUserDto.username);

        createUserDto.password = await encryptPassword(createUserDto.password);

        const newUser = await this.usersRepository.create(createUserDto);
        return UserMapper.toDomain(newUser);
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        if (updateUserDto.username) {
            const user = await this.usersRepository.findByUsername(updateUserDto.username);

            if (user) throw new DuplicateException('user', updateUserDto.username);
        }

        if (updateUserDto.password) {
            updateUserDto.password = await encryptPassword(updateUserDto.password);
        }

        if (updateUserDto.roleId) {
            const role = await this.rolesService.findById(updateUserDto.roleId);

            if (!role) throw new ResourceNotFoundException('role', updateUserDto.roleId);
        }

        if (updateUserDto.locationId) {
            const location = await this.locationsService.findById(updateUserDto.locationId);

            if (!location) throw new ResourceNotFoundException('location', updateUserDto.locationId);
        }

        const updatedUser = await this.usersRepository.update(id, updateUserDto);
        return UserMapper.toDomain(updatedUser);
    }

    async softDelete(id: number) {
        const user = await this.findById(id);

        if (!user) throw new ResourceNotFoundException('user', id);

        return await this.usersRepository.softDelete(id);
    }

    async restore(id: number) {
        return await this.usersRepository.restore(id);
    }
}
