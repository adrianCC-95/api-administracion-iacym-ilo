import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from '../entities/expense.entity';
import { ExpenseRepositoryImpl } from './expense.repository.impl';
import { ExpenseRepository } from './expense.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ExpenseEntity])],
    providers: [
        {
            provide: ExpenseRepositoryImpl,
            useClass: ExpenseRepository,
        },
    ],
    exports: [ExpenseRepositoryImpl],
})
export class ExpensesRepositoryModule {}
