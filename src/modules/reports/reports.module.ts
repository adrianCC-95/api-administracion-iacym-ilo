import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IncomeEntity } from '../incomes/entities/income.entity';

import { ReportsController } from './reports.controller';

import { ReportsService } from './reports.service';

import { ReportsRepository } from './repositories/reports.repository';
import { ExpenseEntity } from '../expenses/entities/expense.entity';

@Module({
    imports: [TypeOrmModule.forFeature([IncomeEntity, ExpenseEntity])],

    controllers: [ReportsController],

    providers: [ReportsService, ReportsRepository],

    exports: [ReportsService],
})
export class ReportsModule {}
