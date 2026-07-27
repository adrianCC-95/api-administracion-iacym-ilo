import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { envConfig } from './config/env/env.config';
import { getGlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { getCorsOptions } from './utils/cors-options';

import { initializeTransactionalContext, addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

async function bootstrap() {
    initializeTransactionalContext();
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const apiPrefix = envConfig().app.apiPrefix;

    app.enableCors(getCorsOptions());
    app.useGlobalPipes(getGlobalValidationPipe());

    if (apiPrefix) {
        app.setGlobalPrefix(apiPrefix);
    }
    const dataSource = app.get(DataSource);
    addTransactionalDataSource(dataSource);
    await app.listen(envConfig().app.port);
}
void bootstrap();
