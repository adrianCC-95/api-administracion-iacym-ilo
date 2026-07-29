import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetDashboardQueryDto } from './dto/get-dashboard-query.dto';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}
    @HttpCode(HttpStatus.OK)
    @Get()
    getDashboard(@Query() queryDto: GetDashboardQueryDto) {
        return this.dashboardService.getDashboard(queryDto);
    }
}
