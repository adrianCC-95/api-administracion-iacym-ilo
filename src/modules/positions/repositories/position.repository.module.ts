import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PositionEntity } from '../entities/position.entity';
import { PositionRepositoryImpl } from './position.repository.impl';
import { PositionRepository } from './position.repository';

@Module({
    imports: [TypeOrmModule.forFeature([PositionEntity])],
    providers: [
        {
            provide: PositionRepositoryImpl,
            useClass: PositionRepository,
        },
    ],
    exports: [PositionRepositoryImpl],
})
export class PositionsRepositoryModule {}
