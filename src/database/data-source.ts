import type { DataSourceOptions } from 'typeorm';
import { envConfig } from '../config/env/env.config';
import { isDevEnv } from '../utils/env';

export const DefaultDataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: envConfig().database.host,
    port: envConfig().database.port,
    username: envConfig().database.username,
    password: envConfig().database.password,
    database: envConfig().database.name,
    synchronize: false, //! IMPORTANTE: DEJAR LA PROPIEDAD synchronize siempre en FALSE, caso contrario se podria perder informacion de la base de datos
    logging: isDevEnv(),
};
