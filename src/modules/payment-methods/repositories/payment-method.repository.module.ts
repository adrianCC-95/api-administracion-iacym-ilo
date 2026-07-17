import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethodEntity } from '../entities/payment-method.entity';
import { PaymentMethodRepositoryImpl } from './payment-method.repository.impl';
import { PaymentMethodRepository } from './payment-method.repository';

@Module({
    imports: [TypeOrmModule.forFeature([PaymentMethodEntity])],
    providers: [
        {
            provide: PaymentMethodRepositoryImpl,
            useClass: PaymentMethodRepository,
        },
    ],
    exports: [PaymentMethodRepositoryImpl],
})
export class PaymentMethodsRepositoryModule {}
