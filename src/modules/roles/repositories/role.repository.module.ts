import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../entities/role.entity';
import { RoleRepositoryImpl } from './role.repository.impl';
import { RoleRepository } from './role.repository';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity])],
    providers: [
        {
            provide: RoleRepositoryImpl,
            useClass: RoleRepository,
        },
    ],
    exports: [RoleRepositoryImpl],
})
export class RolesRepositoryModule {}
