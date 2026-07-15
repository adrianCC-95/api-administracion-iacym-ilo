import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinistryEntity } from '../entities/ministry.entity';
import { MinistryRepositoryImpl } from './ministry.repository.impl';
import { MinistryRepository } from './ministry.repository';

@Module({
    imports: [TypeOrmModule.forFeature([MinistryEntity])],
    providers: [
        {
            provide: MinistryRepositoryImpl,
            useClass: MinistryRepository,
        },
    ],
    exports: [MinistryRepositoryImpl],
})
export class MinistriesRepositoryModule {}
