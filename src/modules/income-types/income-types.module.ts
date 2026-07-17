import { Module } from '@nestjs/common';
import { IncomeTypesService } from './income-types.service';
import { IncomeTypesController } from './income-types.controller';
import { IncomeTypesRepositoryModule } from './repositories/income-type.repository.module';

@Module({
    imports: [IncomeTypesRepositoryModule],
    controllers: [IncomeTypesController],
    providers: [IncomeTypesService],
    exports: [IncomeTypesService],
})
export class IncomeTypesModule {}
