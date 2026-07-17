import { Module } from '@nestjs/common';
import { EnvModule } from './config/env/env.module';
import { GlobalProviders } from './common/providers/global-providers';
import { DatabaseModule } from './database/database.module';
import { RootModule } from './modules/root.module';
import { JwtAuthModule } from './modules/auth/strategies/jwt.module';
import { StaticModule } from './common/modules/static/static.module';

@Module({
    imports: [EnvModule, DatabaseModule, JwtAuthModule, RootModule, StaticModule],
    providers: [...GlobalProviders],
})
export class AppModule {}
