import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeTypeEntity } from '../entities/income-type.entity';
import { IncomeTypeRepositoryImpl } from './income-type.repository.impl';
import { IncomeTypeRepository } from './income-type.repository';

@Module({
    imports: [TypeOrmModule.forFeature([IncomeTypeEntity])],
    providers: [
        {
            provide: IncomeTypeRepositoryImpl,
            useClass: IncomeTypeRepository,
        },
    ],
    exports: [IncomeTypeRepositoryImpl],
})
export class IncomeTypesRepositoryModule {}
