import { PageInfo, PaginatedResult } from '../types/pagination';

export class PaginationBuilder {
    static pageInfo(totalHits: number, currentPage: number, pageSize: number): PageInfo {
        const totalPages = Math.max(Math.ceil(totalHits / pageSize), 1);

        const hasPrevPage = currentPage > 1;
        const hasNextPage = currentPage < totalPages;

        const prevPage = hasPrevPage ? currentPage - 1 : 1;
        const nextPage = hasNextPage ? currentPage + 1 : totalPages;

        return {
            navigation: {
                currentPage,
                firstPage: 1,
                lastPage: totalPages,
                nextPage,
                prevPage,
            },
            flags: {
                hasNextPage,
                hasPrevPage,
            },
            meta: {
                totalPages,
                totalHits,
            },
        };
    }
}

export function mapPaginated<T, U>(source: PaginatedResult<T>, mapper: (item: T) => U): PaginatedResult<U> {
    return {
        pageInfo: source.pageInfo,
        items: source.items.map(mapper),
    };
}
