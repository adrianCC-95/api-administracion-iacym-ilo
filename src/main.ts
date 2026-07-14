import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { envConfig } from './config/env/env.config';
import { getGlobalValidationPipe } from './common/pipes/global-validation.pipe';
import { getCorsOptions } from './utils/cors-options';

// 👇 Importaciones necesarias para las transacciones
import { initializeTransactionalContext, addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

async function bootstrap() {
    // 🔹 Inicializa el contexto transaccional global (obligatorio)
    initializeTransactionalContext();
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const apiPrefix = envConfig().app.apiPrefix;

    app.enableCors(getCorsOptions());
    app.useGlobalPipes(getGlobalValidationPipe());

    if (apiPrefix) {
        app.setGlobalPrefix(apiPrefix);
    }
    // 🔹 Obtiene el DataSource de TypeORM del contenedor NestJS
    const dataSource = app.get(DataSource);

    // 🔹 Asocia el DataSource al contexto transaccional
    addTransactionalDataSource(dataSource);
    await app.listen(envConfig().app.port);
}
void bootstrap();
