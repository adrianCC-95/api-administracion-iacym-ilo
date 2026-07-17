import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';

import { IncomeEntity } from '../entities/income.entity';
import { Income, IncomeResponse } from '../models/income.model';

import { MemberMapper } from '../../members/mappers/member.mapper';
import { IncomeTypeMapper } from '../../income-types/mappers/income-type.mapper';
import { PaymentMethodMapper } from '../../payment-methods/mappers/payment-method.mapper';
import { UserMapper } from '../../users/mappers/user.mapper';
import { FileMapper } from 'src/modules/files/mappers/file.mapper';
import { MapperHelper } from 'src/utils/mapper-helper';

export class IncomeMapper {
    static toDomain(entity: IncomeEntity): Income {
        const income = new Income();

        income.id = entity.id;

        income.member = MemberMapper.toDomain(MapperHelper.require(entity.member, 'Income.member'));

        income.incomeType = IncomeTypeMapper.toDomain(entity.incomeType);

        income.paymentMethod = PaymentMethodMapper.toDomain(entity.paymentMethod);

        income.registeredBy = UserMapper.toDomain(entity.registeredBy);

        income.amount = Number(entity.amount);

        income.incomeDate = entity.incomeDate;

        income.voucherFile = entity.voucherFile ? FileMapper.toDomain(entity.voucherFile) : null;

        income.referenceNumber = entity.referenceNumber || null;

        income.observation = entity.observation;

        income.createdAt = entity.createdAt;
        income.updatedAt = entity.updatedAt;
        income.deletedAt = entity.deletedAt;

        return income;
    }

    static toDomainList(entities: PaginatedResult<IncomeEntity>): PaginatedResult<Income> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(income: Income): IncomeResponse {
        const response = new IncomeResponse();

        response.id = income.id;

        response.member = income.member;

        response.incomeType = income.incomeType;

        response.paymentMethod = income.paymentMethod;

        response.registeredBy = income.registeredBy;

        response.amount = income.amount;

        response.incomeDate = income.incomeDate;

        response.voucherFile = income.voucherFile ? FileMapper.toResponse(income.voucherFile) : null;

        response.referenceNumber = income.referenceNumber;

        response.observation = income.observation;

        response.createdAt = income.createdAt;

        response.isDeleted = income.deletedAt !== null;

        return response;
    }

    static toResponseList(list: PaginatedResult<Income>): PaginatedResult<IncomeResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
