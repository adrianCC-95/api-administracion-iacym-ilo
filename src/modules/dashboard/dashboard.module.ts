import { Module } from '@nestjs/common';
import { ReportsModule } from '../reports/reports.module';
import { MembersModule } from '../members/members.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MinistriesModule } from '../ministries/ministries.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [ReportsModule, MembersModule, MinistriesModule, UsersModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
