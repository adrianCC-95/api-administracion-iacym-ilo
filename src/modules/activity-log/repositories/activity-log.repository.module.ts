import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityLogRepositoryImpl } from './activity-log.repository.impl';
import { ActivityLogRepository } from './activity-log.repository';
import { ActivityLogEntity } from '../entities/activity-log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ActivityLogEntity])],
    providers: [
        {
            provide: ActivityLogRepositoryImpl,
            useClass: ActivityLogRepository,
        },
    ],
    exports: [ActivityLogRepositoryImpl],
})
export class ActivityLogRepositoryModule {}
