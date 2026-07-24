import { Module } from '@nestjs/common';
import { ExpenseTypesService } from './expense-types.service';
import { ExpenseTypesController } from './expense-types.controller';
import { ExpenseTypesRepositoryModule } from './repositories/expense-type.repository.module';

@Module({
    imports: [ExpenseTypesRepositoryModule],
    controllers: [ExpenseTypesController],
    providers: [ExpenseTypesService],
    exports: [ExpenseTypesService],
})
export class ExpenseTypesModule {}
