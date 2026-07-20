import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) {}

    @HttpCode(HttpStatus.OK)
    @Get()
    getDashboard() {
        return this.dashboardService.getDashboard();
    }
}
