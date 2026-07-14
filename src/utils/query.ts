import { SelectQueryBuilder } from 'typeorm';
import { PaginatedResult, Pagination, SortDirection, StatusFilter } from '../types/pagination';
import { PaginationBuilder } from './pagination';

export class Query {
    static async fetchPaged<Entity extends {}>(
        qb: SelectQueryBuilder<Entity>,
        page: Pagination['page'] | undefined = 1,
        size: Pagination['size'] | undefined = 10,
    ): Promise<PaginatedResult<Entity>> {
        const offset = (page - 1) * size;

        const countQuery = qb.clone();
        const dataQuery = qb.offset(offset).limit(size);

        const total = await countQuery.getCount();
        const data = await dataQuery.getMany();

        const pageInfo = PaginationBuilder.pageInfo(total, page, size);

        return { pageInfo, items: data };
    }

    static sortCriteria<Entity extends {}>(qb: SelectQueryBuilder<Entity>, field?: string, direction?: SortDirection) {
        if (field && direction) {
            qb.orderBy(field, direction);
        }
    }

    static applyStatusFilter<Entity extends {}>(qb: SelectQueryBuilder<Entity>, alias: string, status?: StatusFilter) {
        if (status === StatusFilter.ACTIVE) {
            qb.andWhere(`${alias}.deletedAt IS NULL`);
        } else if (status === StatusFilter.INACTIVE) {
            qb.andWhere(`${alias}.deletedAt IS NOT NULL`);
            qb.withDeleted();
        } else if (status === StatusFilter.ALL) {
            qb.withDeleted();
        }
    }
}
