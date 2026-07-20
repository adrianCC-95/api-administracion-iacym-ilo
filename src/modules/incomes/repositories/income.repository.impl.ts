import { CreateIncomeDto } from '../dto/create-income.dto';
import { IncomeEntity } from '../entities/income.entity';
import { FindIncomeByCriteriaDto } from '../dto/find-income-by-criteria';
import { UpdateIncomeDto } from '../dto/update-income.dto';
import { Income } from '../models/income.model';
import { PaginatedResult } from '../../../types/pagination';
import { ExportIncomeCriteriaDto } from '../dto/export-income-criteria.dto';

export abstract class IncomeRepositoryImpl {
    abstract create(createIncomeDto: CreateIncomeDto, userId: number): Promise<IncomeEntity>;
    abstract findById(id: Income['id']): Promise<IncomeEntity | null>;
    abstract findByCriteria(criteria: FindIncomeByCriteriaDto): Promise<PaginatedResult<IncomeEntity>>;
    abstract update(id: Income['id'], updateIncomeDto: UpdateIncomeDto): Promise<IncomeEntity>;
    abstract softDelete(id: Income['id']): Promise<void>;
    abstract findByIdWithDeleted(id: Income['id']): Promise<IncomeEntity | null>;
    abstract delete(id: Income['id']): Promise<void>;
    abstract restore(id: Income['id']): Promise<void>;
    abstract exportByCriteria(criteria: ExportIncomeCriteriaDto): Promise<IncomeEntity[]>;
}
