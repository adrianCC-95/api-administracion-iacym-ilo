import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';
import { ExpenseEntity } from '../entities/expense.entity';
import { ExpenseDetailEntity } from '../entities/expense-detail.entity';
import { Expense, ExpenseDetail, ExpenseResponse, ExpenseDetailResponse } from '../models/expense-model';
import { LocationMapper } from '../../locations/mappers/location.mapper';
import { MinistryMapper } from '../../ministries/mappers/ministry.mapper';
import { UserMapper } from '../../users/mappers/user.mapper';
import { ExpenseTypeMapper } from '../../expense-types/mappers/expense-type.mapper';
import { PaymentMethodMapper } from '../../payment-methods/mappers/payment-method.mapper';
import { FileMapper } from 'src/modules/files/mappers/file.mapper';
import { MapperHelper } from 'src/utils/mapper-helper';

export class ExpenseMapper {
    static toDomainDetail(entity: ExpenseDetailEntity): ExpenseDetail {
        const detail = new ExpenseDetail();
        detail.id = entity.id;
        detail.expenseType = ExpenseTypeMapper.toDomain(entity.expenseType);
        detail.paymentMethod = PaymentMethodMapper.toDomain(entity.paymentMethod);
        detail.voucherFile = entity.voucherFile ? FileMapper.toDomain(entity.voucherFile) : null;
        detail.supplierOrBeneficiary = entity.supplierOrBeneficiary;
        detail.voucherType = entity.voucherType;
        detail.voucherNumber = entity.voucherNumber || null;
        detail.amount = Number(entity.amount);
        detail.conceptDetail = entity.conceptDetail;
        return detail;
    }

    static toDomain(entity: ExpenseEntity): Expense {
        const expense = new Expense();
        expense.id = entity.id;
        expense.title = entity.title;
        expense.location = LocationMapper.toDomain(MapperHelper.require(entity.location, 'Expense.location'));
        expense.ministry = entity.ministry ? MinistryMapper.toDomain(entity.ministry) : null;
        expense.registeredBy = UserMapper.toDomain(entity.registeredBy);
        expense.totalAmount = Number(entity.totalAmount);
        expense.expenseDate = entity.expenseDate;
        expense.observation = entity.observation;
        expense.createdAt = entity.createdAt;
        expense.updatedAt = entity.updatedAt;
        expense.deletedAt = entity.deletedAt;
        expense.details = entity.details ? entity.details.map((d) => this.toDomainDetail(d)) : [];
        return expense;
    }

    static toDomainList(entities: PaginatedResult<ExpenseEntity>): PaginatedResult<Expense> {
        return mapPaginated(entities, (entity) => this.toDomain(entity));
    }

    static toResponseDetail(detail: ExpenseDetail): ExpenseDetailResponse {
        return {
            id: detail.id,
            expenseType: detail.expenseType,
            paymentMethod: detail.paymentMethod,
            voucherFile: detail.voucherFile ? FileMapper.toResponse(detail.voucherFile) : null,
            supplierOrBeneficiary: detail.supplierOrBeneficiary,
            voucherType: detail.voucherType,
            voucherNumber: detail.voucherNumber,
            amount: detail.amount,
            conceptDetail: detail.conceptDetail,
        };
    }

    static toResponse(expense: Expense): ExpenseResponse {
        return {
            id: expense.id,
            title: expense.title,
            location: expense.location,
            ministry: expense.ministry,
            registeredBy: expense.registeredBy,
            totalAmount: expense.totalAmount,
            expenseDate: expense.expenseDate,
            observation: expense.observation,
            details: expense.details ? expense.details.map((d) => this.toResponseDetail(d)) : [],
            createdAt: expense.createdAt,
            isDeleted: expense.deletedAt !== null,
        };
    }

    static toResponseList(list: PaginatedResult<Expense>): PaginatedResult<ExpenseResponse> {
        return mapPaginated(list, (expense) => this.toResponse(expense));
    }
}
