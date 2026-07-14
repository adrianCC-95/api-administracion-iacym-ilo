export type PageInfo = {
    navigation: {
        currentPage: number;
        firstPage: number;
        lastPage: number;
        prevPage: number;
        nextPage: number;
    };
    meta: {
        totalHits: number;
        totalPages: number;
    };
    flags: {
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
};

export type Pagination = {
    size: number;
    page: number;
};

export type SortDirection = 'ASC' | 'DESC';

export type PaginatedResult<Entity> = {
    items: Entity[];
    pageInfo: PageInfo;
};

export enum StatusFilter {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ALL = 'ALL',
}
