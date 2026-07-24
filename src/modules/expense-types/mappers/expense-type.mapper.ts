import { ExpenseType, ExpenseTypeResponse } from '../models/expense-type.model';
import { ExpenseTypeEntity } from '../entities/expense-type.entity';
import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';

export class ExpenseTypeMapper {
    static toDomain(entity: ExpenseTypeEntity): ExpenseType {
        const expenseType = new ExpenseType();

        expenseType.id = entity.id;
        expenseType.name = entity.name;
        expenseType.description = entity.description;
        expenseType.createdAt = entity.createdAt;
        expenseType.updatedAt = entity.updatedAt;
        expenseType.deletedAt = entity.deletedAt;

        return expenseType;
    }

    static toDomainList(entities: PaginatedResult<ExpenseTypeEntity>): PaginatedResult<ExpenseType> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(expenseType: ExpenseType): ExpenseTypeResponse {
        const response = new ExpenseTypeResponse();

        response.id = expenseType.id;
        response.name = expenseType.name;
        response.description = expenseType.description;
        response.createdAt = expenseType.createdAt;
        response.isDeleted = expenseType.deletedAt !== null;

        return response;
    }

    static toResponseList(list: PaginatedResult<ExpenseType>): PaginatedResult<ExpenseTypeResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
