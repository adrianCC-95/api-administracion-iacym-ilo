import { Injectable } from '@nestjs/common';
import { ActivityLogRepositoryImpl } from './repositories/activity-log.repository.impl';
import { ActivityLog } from './models/acitivity-log';
import { ActivityLogMapper } from './mappers/activity-log';
import { FindActivityLogByCriteriaDto } from './dto/find-activity-log-by-criteria';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
    constructor(private readonly activityLogRepository: ActivityLogRepositoryImpl) {}

    async findById(id: ActivityLog['id']) {
        const entity = await this.activityLogRepository.findById(id);
        return entity ? ActivityLogMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindActivityLogByCriteriaDto) {
        const entities = await this.activityLogRepository.findByCriteria(criteria);
        return ActivityLogMapper.toDomainList(entities);
    }

    async create(createActivityLog: CreateActivityLogDto) {
        const newActivityLog = await this.activityLogRepository.create(createActivityLog);
        return ActivityLogMapper.toDomain(newActivityLog);
    }
}
