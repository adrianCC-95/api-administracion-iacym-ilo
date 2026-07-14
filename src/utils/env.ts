import { envConfig } from '../config/env/env.config';
import { EnvironmentMode } from './enums/env';

export function getEnvMode() {
    return envConfig().app.envMode;
}

export function isDevEnv() {
    return envConfig().app.envMode === EnvironmentMode.DEVELOPMENT;
}

export function isProdEnv() {
    return envConfig().app.envMode === EnvironmentMode.PRODUCTION;
}
