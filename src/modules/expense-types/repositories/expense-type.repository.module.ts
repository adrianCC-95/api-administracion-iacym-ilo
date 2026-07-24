import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseTypeEntity } from '../entities/expense-type.entity';
import { ExpenseTypeRepositoryImpl } from './expense-type.repository.impl';
import { ExpenseTypeRepository } from './expense-type.repository';

@Module({
    imports: [TypeOrmModule.forFeature([ExpenseTypeEntity])],
    providers: [
        {
            provide: ExpenseTypeRepositoryImpl,
            useClass: ExpenseTypeRepository,
        },
    ],
    exports: [ExpenseTypeRepositoryImpl],
})
export class ExpenseTypesRepositoryModule {}
