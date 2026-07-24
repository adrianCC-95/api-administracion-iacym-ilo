import { CreateExpenseDto } from '../dto/create-expense.dto';
import { ExpenseEntity } from '../entities/expense.entity';
import { FindExpenseByCriteriaDto } from '../dto/find-expense-by-criteria.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { Expense } from '../models/expense-model';
import { PaginatedResult } from '../../../types/pagination';
import { ExportExpenseCriteriaDto } from '../dto/export-expense-criteria.dto';

export abstract class ExpenseRepositoryImpl {
    abstract create(createExpenseDto: CreateExpenseDto, userId: number): Promise<ExpenseEntity>;
    abstract findById(id: Expense['id']): Promise<ExpenseEntity | null>;
    abstract findByCriteria(criteria: FindExpenseByCriteriaDto): Promise<PaginatedResult<ExpenseEntity>>;
    abstract update(id: Expense['id'], updateExpenseDto: UpdateExpenseDto): Promise<ExpenseEntity>;
    abstract softDelete(id: Expense['id']): Promise<void>;
    abstract findByIdWithDeleted(id: Expense['id']): Promise<ExpenseEntity | null>;
    // abstract delete(id: Expense['id']): Promise<void>;
    abstract restore(id: Expense['id']): Promise<void>;
    abstract exportByCriteria(criteria: ExportExpenseCriteriaDto): Promise<ExpenseEntity[]>;
}
