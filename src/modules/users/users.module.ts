import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesModule } from '../roles/roles.module';
import { LocationsModule } from '../locations/locations.module';
import { UsersRepositoryModule } from './repositories/user.repository.module';

@Module({
    imports: [UsersRepositoryModule, RolesModule, LocationsModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
