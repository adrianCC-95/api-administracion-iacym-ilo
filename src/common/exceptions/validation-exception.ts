import { AppException } from './app-exception';
import { HttpStatus } from '@nestjs/common';

export class ValidationException extends AppException {
    constructor(message: string, details?: any) {
        super(message, HttpStatus.BAD_REQUEST, 'VALIDATION_ERROR', details);
    }
}
