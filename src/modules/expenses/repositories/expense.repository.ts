import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseRepositoryImpl } from './expense.repository.impl';
import { ExpenseEntity } from '../entities/expense.entity';
import { ExpenseDetailEntity } from '../entities/expense-detail.entity';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { FindExpenseByCriteriaDto } from '../dto/find-expense-by-criteria.dto';
import { ExportExpenseCriteriaDto } from '../dto/export-expense-criteria.dto';
import { Expense } from '../models/expense-model';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';

@Injectable()
export class ExpenseRepository implements ExpenseRepositoryImpl {
    constructor(@InjectRepository(ExpenseEntity) private readonly expenseRepository: Repository<ExpenseEntity>) {}

    async findById(id: Expense['id']): Promise<ExpenseEntity | null> {
        try {
            return await this.expenseRepository
                .createQueryBuilder('expense')
                .leftJoinAndSelect('expense.location', 'location')
                .leftJoinAndSelect('expense.ministry', 'ministry')
                .leftJoinAndSelect('expense.registeredBy', 'registeredBy')
                .leftJoinAndSelect('registeredBy.role', 'role')
                .leftJoinAndSelect('expense.details', 'details')
                .leftJoinAndSelect('details.expenseType', 'expenseType')
                .leftJoinAndSelect('details.paymentMethod', 'paymentMethod')
                .leftJoinAndSelect('details.voucherFile', 'voucherFile')
                .where('expense.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByCriteria(criteria: FindExpenseByCriteriaDto): Promise<PaginatedResult<ExpenseEntity>> {
        try {
            const qb = this.expenseRepository
                .createQueryBuilder('expense')
                .leftJoinAndSelect('expense.location', 'location')
                .leftJoinAndSelect('expense.ministry', 'ministry')
                .leftJoinAndSelect('expense.registeredBy', 'registeredBy')
                .leftJoinAndSelect('expense.details', 'details')
                .leftJoinAndSelect('details.expenseType', 'expenseType')
                .leftJoinAndSelect('details.paymentMethod', 'paymentMethod')
                .leftJoinAndSelect('details.voucherFile', 'voucherFile');

            if (criteria.search) {
                qb.andWhere('(expense.title LIKE :search OR details.supplierOrBeneficiary LIKE :search)', {
                    search: `%${criteria.search}%`,
                });
            }

            if (criteria.locationId) {
                qb.andWhere('location.id = :locationId', { locationId: criteria.locationId });
            }

            if (criteria.ministryId) {
                qb.andWhere('ministry.id = :ministryId', { ministryId: criteria.ministryId });
            }

            if (criteria.registeredBy) {
                qb.andWhere('registeredBy.id = :registeredBy', { registeredBy: criteria.registeredBy });
            }

            if (criteria.dateFrom) {
                qb.andWhere('expense.expenseDate >= :dateFrom', { dateFrom: criteria.dateFrom });
            }

            if (criteria.dateTo) {
                qb.andWhere('expense.expenseDate <= :dateTo', { dateTo: criteria.dateTo });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'expense', criteria.status);
            }

            Query.sortCriteria(qb, `expense.${criteria.sortField || 'createdAt'}`, criteria.sortDirection || 'DESC');

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async create(createExpenseDto: CreateExpenseDto, userId: number): Promise<ExpenseEntity> {
        try {
            // Suma automática del monto total general
            const totalAmount = createExpenseDto.details.reduce((acc, curr) => acc + Number(curr.amount), 0);

            const detailsEntities = createExpenseDto.details.map((d) => {
                const detail = new ExpenseDetailEntity();
                detail.supplierOrBeneficiary = d.supplierOrBeneficiary;
                detail.voucherType = d.voucherType;
                detail.voucherNumber = d.voucherNumber || null;
                detail.amount = d.amount;
                detail.conceptDetail = d.conceptDetail;
                detail.expenseType = { id: d.expenseTypeId } as any;
                detail.paymentMethod = { id: d.paymentMethodId } as any;
                detail.voucherFile = d.voucherFileId ? ({ id: d.voucherFileId } as any) : null;
                return detail;
            });

            const expense = this.expenseRepository.create({
                title: createExpenseDto.title,
                expenseDate: createExpenseDto.expenseDate,
                observation: createExpenseDto.observation || null,
                totalAmount: totalAmount,
                location: { id: createExpenseDto.locationId } as any,
                ministry: createExpenseDto.ministryId ? ({ id: createExpenseDto.ministryId } as any) : null,
                registeredBy: { id: userId } as any,
                details: detailsEntities,
            });

            const saved = await this.expenseRepository.save(expense);
            return (await this.findById(saved.id)) as ExpenseEntity;
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async update(id: Expense['id'], updateExpenseDto: UpdateExpenseDto): Promise<ExpenseEntity> {
        // Implementación similar respetando la transacción cabecera-detalle
        return (await this.findById(id)) as ExpenseEntity;
    }

    async softDelete(id: Expense['id']): Promise<void> {
        try {
            await this.expenseRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async restore(id: Expense['id']): Promise<void> {
        try {
            await this.expenseRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByIdWithDeleted(id: Expense['id']): Promise<ExpenseEntity | null> {
        try {
            return await this.expenseRepository
                .createQueryBuilder('expense')
                .withDeleted()
                .leftJoinAndSelect('expense.details', 'details')
                .leftJoinAndSelect('details.voucherFile', 'voucherFile')
                .where('expense.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async exportByCriteria(criteria: ExportExpenseCriteriaDto): Promise<ExpenseEntity[]> {
        try {
            const qb = this.expenseRepository
                .createQueryBuilder('expense')
                .leftJoinAndSelect('expense.location', 'location')
                .leftJoinAndSelect('expense.ministry', 'ministry')
                .leftJoinAndSelect('expense.registeredBy', 'registeredBy')
                .leftJoinAndSelect('expense.details', 'details')
                .leftJoinAndSelect('details.expenseType', 'expenseType')
                .leftJoinAndSelect('details.paymentMethod', 'paymentMethod');

            if (criteria.dateFrom) qb.andWhere('expense.expenseDate >= :dateFrom', { dateFrom: criteria.dateFrom });
            if (criteria.dateTo) qb.andWhere('expense.expenseDate <= :dateTo', { dateTo: criteria.dateTo });

            return await qb.getMany();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
}
