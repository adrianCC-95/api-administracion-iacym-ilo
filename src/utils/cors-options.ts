import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { envConfig } from '../config/env/env.config';

export const getCorsOptions = (): CorsOptions => {
    return {
        origin: envConfig().app.allowedDomains,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        optionsSuccessStatus: 200,
    };
};
