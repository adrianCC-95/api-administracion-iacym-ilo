import { AppException } from './app-exception';
import { HttpStatus } from '@nestjs/common';

export class CriticalInternalError extends AppException {
    constructor(message: string, details?: any) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_CRITICAL_ERROR', details);
    }
}
