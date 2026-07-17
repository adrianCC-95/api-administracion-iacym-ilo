import { CreateIncomeTypeDto } from '../dto/create-income-type.dto';
import { IncomeTypeEntity } from '../entities/income-type.entity';
import { FindIncomeTypeByCriteriaDto } from '../dto/find-income-type-by-criteria';
import { UpdateIncomeTypeDto } from '../dto/update-income-type.dto';
import { IncomeType } from '../models/income-type.model';
import { PaginatedResult } from '../../../types/pagination';

export abstract class IncomeTypeRepositoryImpl {
    abstract create(createIncomeTypeDto: CreateIncomeTypeDto): Promise<IncomeTypeEntity>;
    abstract findById(id: IncomeType['id']): Promise<IncomeTypeEntity | null>;
    abstract findByName(name: string): Promise<IncomeTypeEntity | null>;
    abstract findByCriteria(criteria: FindIncomeTypeByCriteriaDto): Promise<PaginatedResult<IncomeTypeEntity>>;
    abstract update(id: IncomeType['id'], updateIncomeTypeDto: UpdateIncomeTypeDto): Promise<IncomeTypeEntity>;
    abstract softDelete(id: IncomeType['id']): Promise<void>;
    abstract restore(id: IncomeType['id']): Promise<void>;
}
