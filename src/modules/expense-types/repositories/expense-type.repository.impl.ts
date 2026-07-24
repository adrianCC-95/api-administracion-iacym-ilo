import { CreateExpenseTypeDto } from '../dto/create-expense-type.dto';
import { ExpenseTypeEntity } from '../entities/expense-type.entity';
import { FindExpenseTypeByCriteriaDto } from '../dto/find-expense-type-by-criteria';
import { UpdateExpenseTypeDto } from '../dto/update-expense-type.dto';
import { ExpenseType } from '../models/expense-type.model';
import { PaginatedResult } from '../../../types/pagination';

export abstract class ExpenseTypeRepositoryImpl {
    abstract create(createExpenseTypeDto: CreateExpenseTypeDto): Promise<ExpenseTypeEntity>;
    abstract findById(id: ExpenseType['id']): Promise<ExpenseTypeEntity | null>;
    abstract findByName(name: string): Promise<ExpenseTypeEntity | null>;
    abstract findByCriteria(criteria: FindExpenseTypeByCriteriaDto): Promise<PaginatedResult<ExpenseTypeEntity>>;
    abstract update(id: ExpenseType['id'], updateExpenseTypeDto: UpdateExpenseTypeDto): Promise<ExpenseTypeEntity>;
    abstract softDelete(id: ExpenseType['id']): Promise<void>;
    abstract findByIdWithDeleted(id: ExpenseType['id']): Promise<ExpenseTypeEntity | null>;
    abstract restore(id: ExpenseType['id']): Promise<void>;
}
