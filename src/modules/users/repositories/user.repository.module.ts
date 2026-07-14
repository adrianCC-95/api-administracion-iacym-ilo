import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepositoryImpl } from './user.repository.impl';
import { UserRepository } from './user.repository';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [
        {
            provide: UserRepositoryImpl,
            useClass: UserRepository,
        },
    ],
    exports: [UserRepositoryImpl],
})
export class UsersRepositoryModule {}
