import { Module } from '@nestjs/common';
import { ReportsModule } from '../reports/reports.module';
import { MembersModule } from '../members/members.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [ReportsModule, MembersModule],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule {}
