import { ValidationPipe } from '@nestjs/common';
import { isProdEnv } from '../../utils/env';

export function getGlobalValidationPipe(): ValidationPipe {
    return new ValidationPipe({
        transform: true,
        disableErrorMessages: isProdEnv(),
        forbidNonWhitelisted: true,
        whitelist: true,
    });
}
