import { Injectable } from '@nestjs/common';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { ExpenseTypeRepositoryImpl } from './repositories/expense-type.repository.impl';
import { FindExpenseTypeByCriteriaDto } from './dto/find-expense-type-by-criteria';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { ExpenseTypeMapper } from './mappers/expense-type.mapper';
import { ExpenseType } from './models/expense-type.model';

@Injectable()
export class ExpenseTypesService {
    constructor(private readonly expenseTypesRepository: ExpenseTypeRepositoryImpl) {}

    async findById(id: ExpenseType['id']) {
        const entity = await this.expenseTypesRepository.findById(id);
        return entity ? ExpenseTypeMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindExpenseTypeByCriteriaDto) {
        const entities = await this.expenseTypesRepository.findByCriteria(criteria);
        return ExpenseTypeMapper.toDomainList(entities);
    }

    async create(createExpenseTypeDto: CreateExpenseTypeDto) {
        const existingExpenseType = await this.expenseTypesRepository.findByName(createExpenseTypeDto.name);

        if (existingExpenseType) throw new DuplicateException('role', createExpenseTypeDto.name);

        const newExpenseType = await this.expenseTypesRepository.create(createExpenseTypeDto);
        return ExpenseTypeMapper.toDomain(newExpenseType);
    }

    async update(id: ExpenseType['id'], updateExpenseTypeDto: UpdateExpenseTypeDto) {
        const updatedExpenseType = await this.expenseTypesRepository.update(id, updateExpenseTypeDto);
        return ExpenseTypeMapper.toDomain(updatedExpenseType);
    }

    async softDelete(id: ExpenseType['id']) {
        const role = await this.findById(id);

        if (!role) throw new DuplicateException('role', id);

        return await this.expenseTypesRepository.softDelete(id);
    }

    async restore(id: ExpenseType['id']) {
        return await this.expenseTypesRepository.restore(id);
    }

    async findByIdWithDeleted(id: ExpenseType['id']) {
        const entity = await this.expenseTypesRepository.findByIdWithDeleted(id);

        return entity ? ExpenseTypeMapper.toDomain(entity) : null;
    }
}
