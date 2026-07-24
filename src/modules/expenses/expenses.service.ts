import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FindExpenseByCriteriaDto } from './dto/find-expense-by-criteria.dto';
import { ExpenseRepositoryImpl } from './repositories/expense.repository.impl';
import { ExpenseMapper } from './mappers/expense.mapper';
import { Expense } from './models/expense-model';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { LocationsService } from '../locations/locations.service';
import { MinistriesService } from '../ministries/ministries.service';
import { ExpenseTypesService } from '../expense-types/expense-types.service';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { FilesService } from '../files/files.service';
import { StorageService } from '../storage/storage.service';
import { StorageFolder } from '../storage/enums/storage-folder.enum';
import { ExpenseExcelService } from './services/expense-excel.service';
import { ExportExpenseCriteriaDto } from './dto/export-expense-criteria.dto';

@Injectable()
export class ExpensesService {
    constructor(
        private readonly expensesRepository: ExpenseRepositoryImpl,
        private readonly locationsService: LocationsService,
        private readonly ministriesService: MinistriesService,
        private readonly expenseTypesService: ExpenseTypesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly filesService: FilesService,
        private readonly storageService: StorageService,
        private readonly expenseExcelService: ExpenseExcelService,
    ) {}

    async findById(id: Expense['id']) {
        const entity = await this.expensesRepository.findById(id);
        return entity ? ExpenseMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindExpenseByCriteriaDto) {
        const entities = await this.expensesRepository.findByCriteria(criteria);
        return ExpenseMapper.toDomainList(entities);
    }

    async create(createExpenseDto: CreateExpenseDto, vouchers: Express.Multer.File[] | undefined, userId: number) {
        // 1. Validar Sede
        const location = await this.locationsService.findById(createExpenseDto.locationId);
        if (!location) throw new ResourceNotFoundException('Location', createExpenseDto.locationId);

        // 2. Validar Ministerio si aplica
        if (createExpenseDto.ministryId) {
            const ministry = await this.ministriesService.findById(createExpenseDto.ministryId);
            if (!ministry) throw new ResourceNotFoundException('Ministry', createExpenseDto.ministryId);
        }

        // 3. Procesar subida de comprobantes si vienen adjuntos y mapearlos por índice
        if (vouchers && vouchers.length > 0) {
            for (let i = 0; i < createExpenseDto.details.length; i++) {
                if (vouchers[i]) {
                    const storedFile = await this.storageService.upload(vouchers[i], StorageFolder.EXPENSES);
                    createExpenseDto.details[i].voucherFileId = storedFile.id;
                }
            }
        }

        // 4. Validar Tipos de Egreso y Métodos de Pago de cada detalle
        for (const detail of createExpenseDto.details) {
            const expenseType = await this.expenseTypesService.findById(detail.expenseTypeId);
            if (!expenseType) throw new ResourceNotFoundException('Expense Type', detail.expenseTypeId);

            const paymentMethod = await this.paymentMethodsService.findById(detail.paymentMethodId);
            if (!paymentMethod) throw new ResourceNotFoundException('Payment Method', detail.paymentMethodId);
        }

        const newExpense = await this.expensesRepository.create(createExpenseDto, userId);
        return ExpenseMapper.toDomain(newExpense);
    }

    async update(id: Expense['id'], vouchers: Express.Multer.File[] | undefined, updateExpenseDto: UpdateExpenseDto) {
        const expense = await this.findById(id);
        if (!expense) throw new ResourceNotFoundException('Expense', id);

        const updatedExpense = await this.expensesRepository.update(id, updateExpenseDto);
        return ExpenseMapper.toDomain(updatedExpense);
    }

    async softDelete(id: Expense['id']) {
        const expense = await this.findById(id);
        if (!expense) throw new ResourceNotFoundException('Expense', id);

        await this.expensesRepository.softDelete(id);

        // Opcional: Soft delete de archivos adjuntos en los detalles
        if (expense.details) {
            for (const detail of expense.details) {
                if (detail.voucherFile) {
                    await this.filesService.softDelete(detail.voucherFile.id);
                }
            }
        }

        return { message: 'Egreso eliminado correctamente' };
    }

    async restore(id: Expense['id']) {
        const expense = await this.expensesRepository.findByIdWithDeleted(id);
        if (!expense) throw new ResourceNotFoundException('Expense', id);

        await this.expensesRepository.restore(id);

        if (expense.details) {
            for (const detail of expense.details) {
                if (detail.voucherFile) {
                    await this.filesService.restore(detail.voucherFile.id);
                }
            }
        }

        return { message: 'Egreso restaurado correctamente' };
    }

    async export(criteria: ExportExpenseCriteriaDto, res: Response): Promise<void> {
        const entities = await this.expensesRepository.exportByCriteria(criteria);
        const expenses = entities.map((entity) => ExpenseMapper.toDomain(entity));
        await this.expenseExcelService.generateExcelResponse(expenses, criteria, res);
    }
}
