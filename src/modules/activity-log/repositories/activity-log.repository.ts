import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { ActivityLogRepositoryImpl } from './activity-log.repository.impl';
import { ActivityLog } from '../models/acitivity-log';
import { FindActivityLogByCriteriaDto } from '../dto/find-activity-log-by-criteria';
import { ActivityLogEntity } from '../entities/activity-log.entity';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';

@Injectable()
export class ActivityLogRepository implements ActivityLogRepositoryImpl {
    constructor(@InjectRepository(ActivityLogEntity) private activityLogRepository: Repository<ActivityLogEntity>) {}

    async findById(id: ActivityLog['id']): Promise<ActivityLogEntity | null> {
        try {
            return await this.activityLogRepository
                .createQueryBuilder('activityLog')
                .where('activityLog.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async findByCriteria(criteria: FindActivityLogByCriteriaDto): Promise<PaginatedResult<ActivityLogEntity>> {
        try {
            const qb = this.activityLogRepository.createQueryBuilder('activityLog');

            if (criteria.actionType) {
                qb.andWhere('activityLog.actionType LIKE :actionType', { actionType: `%${criteria.actionType}%` });
            }

            if (criteria.authorId) {
                qb.andWhere('author.id = :authorId', { autor: criteria.authorId });
            }

            if (criteria.targetId) {
                qb.andWhere('target.id = :targetId', { target: criteria.targetId });
            }

            Query.sortCriteria(qb, `activityLog.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }

    async create(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLogEntity> {
        try {
            const { afterData, beforeData, ...rest } = createActivityLogDto;
            const createdActivityLog = await this.activityLogRepository.save({
                ...rest,
                ...(afterData ? { afterData } : {}),
                ...(beforeData ? { beforeData } : {}),
            });
            return (await this.findById(createdActivityLog.id)) as ActivityLogEntity;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
