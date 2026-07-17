import { Module } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodsController } from './payment-methods.controller';
import { PaymentMethodsRepositoryModule } from './repositories/payment-method.repository.module';

@Module({
    imports: [PaymentMethodsRepositoryModule],
    controllers: [PaymentMethodsController],
    providers: [PaymentMethodsService],
    exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
