import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { IncomesRepositoryModule } from './repositories/income.repository.module';
import { MembersModule } from '../members/members.module';
import { IncomeTypesModule } from '../income-types/income-types.module';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { FilesModule } from '../files/files.module';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [
        IncomesRepositoryModule,
        MembersModule,
        IncomeTypesModule,
        PaymentMethodsModule,
        FilesModule,
        StorageModule,
    ],
    controllers: [IncomesController],
    providers: [IncomesService],
    exports: [IncomesService],
})
export class IncomesModule {}
