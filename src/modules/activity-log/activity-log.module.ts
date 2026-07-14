import { Module } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { ActivityLogRepositoryModule } from './repositories/activity-log.repository.module';
import { UsersModule } from '../users/users.module';
import { ActivityLogController } from './activity-log.controller';

@Module({
    imports: [ActivityLogRepositoryModule, UsersModule],
    controllers: [ActivityLogController],
    providers: [ActivityLogService],
    exports: [ActivityLogService],
})
export class ActivityLogModule {}
