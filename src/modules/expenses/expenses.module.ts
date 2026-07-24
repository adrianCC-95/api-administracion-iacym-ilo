import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { ExpenseExcelService } from './services/expense-excel.service';
import { ExpenseEntity } from './entities/expense.entity';
import { ExpenseDetailEntity } from './entities/expense-detail.entity';
import { ExpenseRepository } from './repositories/expense.repository';
import { ExpenseRepositoryImpl } from './repositories/expense.repository.impl';
import { LocationsModule } from '../locations/locations.module';
import { MinistriesModule } from '../ministries/ministries.module';
import { ExpenseTypesModule } from '../expense-types/expense-types.module';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { FilesModule } from '../files/files.module';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExpenseEntity, ExpenseDetailEntity]),
        LocationsModule,
        MinistriesModule,
        ExpenseTypesModule,
        PaymentMethodsModule,
        FilesModule,
        StorageModule,
    ],
    controllers: [ExpensesController],
    providers: [
        ExpensesService,
        ExpenseExcelService,
        {
            provide: ExpenseRepositoryImpl,
            useClass: ExpenseRepository,
        },
    ],
    exports: [ExpensesService],
})
export class ExpensesModule {}
