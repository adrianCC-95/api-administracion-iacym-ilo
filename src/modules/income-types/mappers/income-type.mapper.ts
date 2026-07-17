import { IncomeType, IncomeTypeResponse } from '../models/income-type.model';
import { IncomeTypeEntity } from '../entities/income-type.entity';
import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';

export class IncomeTypeMapper {
    static toDomain(entity: IncomeTypeEntity): IncomeType {
        const incomeType = new IncomeType();

        incomeType.id = entity.id;
        incomeType.name = entity.name;
        incomeType.description = entity.description;
        incomeType.createdAt = entity.createdAt;
        incomeType.updatedAt = entity.updatedAt;
        incomeType.deletedAt = entity.deletedAt;

        return incomeType;
    }

    static toDomainList(entities: PaginatedResult<IncomeTypeEntity>): PaginatedResult<IncomeType> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(incomeType: IncomeType): IncomeTypeResponse {
        const response = new IncomeTypeResponse();

        response.id = incomeType.id;
        response.name = incomeType.name;
        response.description = incomeType.description;
        response.createdAt = incomeType.createdAt;
        response.isDeleted = incomeType.deletedAt !== null;

        return response;
    }

    static toResponseList(list: PaginatedResult<IncomeType>): PaginatedResult<IncomeTypeResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
