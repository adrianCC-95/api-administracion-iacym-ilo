import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';
import { ActivityLogService } from './activity-log.service';
import { FindActivityLogByCriteriaDto } from './dto/find-activity-log-by-criteria';
import { ActivityLogMapper } from './mappers/activity-log';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Controller('activity-log')
export class ActivityLogController {
    constructor(private readonly activityLogService: ActivityLogService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindActivityLogByCriteriaDto) {
        const activityLog = await this.activityLogService.findByCriteria(query);
        return ActivityLogMapper.toResponseList(activityLog);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const activityLog = await this.activityLogService.findById(id);
        if (!activityLog) throw new ResourceNotFoundException('activityLog', id);
        return ActivityLogMapper.toResponse(activityLog);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createActivityLogDto: CreateActivityLogDto) {
        const shiftRules = await this.activityLogService.create(createActivityLogDto);
        return ActivityLogMapper.toResponse(shiftRules);
    }
}
