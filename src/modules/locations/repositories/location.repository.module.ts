import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from '../entities/location.entity';
import { LocationRepositoryImpl } from './location.repository.impl';
import { LocationRepository } from './location.repository';

@Module({
    imports: [TypeOrmModule.forFeature([LocationEntity])],
    providers: [
        {
            provide: LocationRepositoryImpl,
            useClass: LocationRepository,
        },
    ],
    exports: [LocationRepositoryImpl],
})
export class LocationsRepositoryModule {}
