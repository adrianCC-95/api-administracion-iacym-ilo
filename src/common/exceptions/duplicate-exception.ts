import { AppException } from './app-exception';
import { HttpStatus } from '@nestjs/common';

export class DuplicateException extends AppException {
    constructor(resourceType: string, identifier: string | number) {
        super(`${resourceType} with identifier ${identifier} already exists`, HttpStatus.CONFLICT, 'RESOURCE_CONFLICT');
    }
}
