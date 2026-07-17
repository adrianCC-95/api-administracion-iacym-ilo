import { PartialType } from '@nestjs/mapped-types';
import { CreateIncomeTypeDto } from './create-income-type.dto';

export class UpdateIncomeTypeDto extends PartialType(CreateIncomeTypeDto) {}
