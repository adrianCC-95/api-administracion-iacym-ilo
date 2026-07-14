import { AppException } from './app-exception';
import { HttpStatus } from '@nestjs/common';

export class AuthenticationException extends AppException {
    constructor(message = 'Authentication failed') {
        super(message, HttpStatus.UNAUTHORIZED, 'AUTHENTICATION_FAILED');
    }
}
