import { AppException } from './app-exception';
import { HttpStatus } from '@nestjs/common';

export class ResourceNotFoundException extends AppException {
    constructor(resourceType: string, identifier: string | number | null | undefined) {
        super(`${resourceType} with identifier ${identifier} not found`, HttpStatus.NOT_FOUND, 'RESOURCE_NOT_FOUND');
    }
}
