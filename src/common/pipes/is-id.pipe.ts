import { BadRequestException, PipeTransform } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

import { NumberUtils } from '../../utils/number';

@Injectable()
export class IsIdPipe implements PipeTransform<string, number> {
    transform(value: string): number {
        if (!NumberUtils.isValidId(value)) {
            throw new BadRequestException(`Invalid Id: ${value}`);
        }
        return Number(value);
    }
}
