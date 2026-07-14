import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { FindUserByCriteriaDto } from '../dto/find-user-by-criteria.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../models/user.model';
import { PaginatedResult } from '../../../types/pagination';

export abstract class UserRepositoryImpl {
    abstract create(createUserDto: CreateUserDto): Promise<UserEntity>;
    abstract findById(id: User['id']): Promise<UserEntity | null>;
    abstract findByUsername(username: string): Promise<UserEntity | null>;
    abstract findByCriteria(criteria: FindUserByCriteriaDto): Promise<PaginatedResult<UserEntity>>;
    abstract update(id: User['id'], updateUserDto: UpdateUserDto): Promise<UserEntity>;
    abstract softDelete(id: User['id']): Promise<void>;
    abstract restore(id: User['id']): Promise<void>;
}
