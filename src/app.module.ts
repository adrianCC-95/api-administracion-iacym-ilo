import { Module } from '@nestjs/common';
import { EnvModule } from './config/env/env.module';
import { GlobalProviders } from './common/providers/global-providers';
import { DatabaseModule } from './database/database.module';
import { RootModule } from './modules/root.module';
import { JwtAuthModule } from './modules/auth/strategies/jwt.module';

@Module({
    imports: [EnvModule, DatabaseModule, JwtAuthModule, RootModule],
    providers: [...GlobalProviders],
})
export class AppModule {}
