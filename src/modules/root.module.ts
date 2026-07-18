import { Module } from '@nestjs/common';

import { LocationsModule } from './locations/locations.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
// import { SocketModule } from './socket/socket.module';
import { RolesModule } from './roles/roles.module';

import { MembersModule } from './members/members.module';
import { MinistriesModule } from './ministries/ministries.module';
import { PositionsModule } from './positions/positions.module';
import { FilesModule } from './files/files.module';
import { StorageModule } from './storage/storage.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { IncomeTypesModule } from './income-types/income-types.module';
import { IncomesModule } from './incomes/incomes.module';
import { ReportsModule } from './reports/reports.module';

@Module({
    imports: [
        UsersModule,
        AuthModule,
        RolesModule,
        LocationsModule,
        ActivityLogModule,
        MembersModule,
        MinistriesModule,
        PositionsModule,
        FilesModule,
        StorageModule,
        PaymentMethodsModule,
        IncomeTypesModule,
        IncomesModule,
        ReportsModule,
    ],
})
export class RootModule {}
