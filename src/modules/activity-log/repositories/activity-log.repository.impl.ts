import { PaginatedResult } from '../../../types/pagination';
import { FindActivityLogByCriteriaDto } from '../dto/find-activity-log-by-criteria';
import { ActivityLog } from '../models/acitivity-log';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { ActivityLogEntity } from '../entities/activity-log.entity';

export abstract class ActivityLogRepositoryImpl {
    abstract create(createOfficeDto: CreateActivityLogDto): Promise<ActivityLogEntity>;
    abstract findById(id: ActivityLog['id']): Promise<ActivityLogEntity | null>;
    abstract findByCriteria(criteria: FindActivityLogByCriteriaDto): Promise<PaginatedResult<ActivityLogEntity>>;
}
