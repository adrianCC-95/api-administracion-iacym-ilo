import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeEntity } from '../entities/income.entity';
import { IncomeRepositoryImpl } from './income.repository.impl';
import { IncomeRepository } from './income.repository';

@Module({
    imports: [TypeOrmModule.forFeature([IncomeEntity])],
    providers: [
        {
            provide: IncomeRepositoryImpl,
            useClass: IncomeRepository,
        },
    ],
    exports: [IncomeRepositoryImpl],
})
export class IncomesRepositoryModule {}
