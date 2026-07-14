import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';
import { ActivityLogEntity } from '../entities/activity-log.entity';
import { ActivityLog, ActivityLogResponse } from '../models/acitivity-log';

export class ActivityLogMapper {
    static toDomain(entity: ActivityLogEntity): ActivityLog {
        const activityLog = new ActivityLog();
        activityLog.id = entity.id;
        activityLog.actionType = entity.actionType;

        activityLog.authorId = entity.authorId;
        activityLog.authorName = entity.authorName;
        activityLog.authorRole = entity.authorRole;

        activityLog.targetId = entity.targetId;
        activityLog.targetTable = entity.targetTable;

        activityLog.beforeData = entity.beforeData;
        activityLog.afterData = entity.afterData;

        activityLog.createdAt = entity.createdAt;

        return activityLog;
    }

    static toDomainList(entities: PaginatedResult<ActivityLogEntity>): PaginatedResult<ActivityLog> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(activityLog: ActivityLog): ActivityLogResponse {
        const response = new ActivityLogResponse();
        response.id = activityLog.id;

        response.targetId = activityLog.targetId;
        response.targetTable = activityLog.targetTable;

        response.authorId = activityLog.authorId;
        response.authorName = activityLog.authorName;
        response.authorRole = activityLog.authorRole;

        response.actionType = activityLog.actionType;

        response.beforeData = activityLog.beforeData;
        response.afterData = activityLog.afterData;
        response.createdAt = activityLog.createdAt;

        return response;
    }

    static toResponseList(list: PaginatedResult<ActivityLog>): PaginatedResult<ActivityLogResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
