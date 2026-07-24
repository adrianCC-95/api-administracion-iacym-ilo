import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { IncomeEntity } from '../entities/income.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncomeRepositoryImpl } from './income.repository.impl';
import { FindIncomeByCriteriaDto } from '../dto/find-income-by-criteria';
import { UpdateIncomeDto } from '../dto/update-income.dto';
import { Income } from '../models/income.model';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';
import { MemberEntity } from '../../members/entities/member.entity';
import { IncomeTypeEntity } from '../../income-types/entities/income-type.entity';
import { PaymentMethodEntity } from '../../payment-methods/entities/payment-method.entity';
import { FileEntity } from '../../files/entities/file.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ExportIncomeCriteriaDto } from '../dto/export-income-criteria.dto';

@Injectable()
export class IncomeRepository implements IncomeRepositoryImpl {
    constructor(@InjectRepository(IncomeEntity) private readonly incomeRepository: Repository<IncomeEntity>) {}

    async findById(id: Income['id']): Promise<IncomeEntity | null> {
        try {
            return await this.incomeRepository
                .createQueryBuilder('income')
                .leftJoinAndSelect('income.member', 'member')
                .leftJoinAndSelect('member.location', 'location')

                .leftJoinAndSelect('member.position', 'position')

                .leftJoinAndSelect('member.ministries', 'ministries')

                .leftJoinAndSelect('income.incomeType', 'incomeType')

                .leftJoinAndSelect('income.paymentMethod', 'paymentMethod')

                .leftJoinAndSelect('income.voucherFile', 'voucherFile')
                .leftJoinAndSelect('income.registeredBy', 'registeredBy')

                .leftJoinAndSelect('registeredBy.location', 'registeredByLocation')
                .leftJoinAndSelect('registeredBy.role', 'registeredByRole')
                .where('income.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByCriteria(criteria: FindIncomeByCriteriaDto): Promise<PaginatedResult<IncomeEntity>> {
        try {
            const qb = this.incomeRepository
                .createQueryBuilder('income')
                .leftJoinAndSelect('income.member', 'member')

                .leftJoinAndSelect('income.incomeType', 'incomeType')

                .leftJoinAndSelect('income.paymentMethod', 'paymentMethod')

                .leftJoinAndSelect('income.voucherFile', 'voucherFile')
                .leftJoinAndSelect('member.location', 'location')

                .leftJoinAndSelect('member.position', 'position')

                // .leftJoinAndSelect('member.ministries', 'ministries')

                .leftJoinAndSelect('income.registeredBy', 'registeredBy')
                .leftJoinAndSelect('registeredBy.location', 'registeredByLocation')
                .leftJoinAndSelect('registeredBy.role', 'registeredByRole');

            if (criteria.memberId) {
                qb.andWhere('member.id = :memberId', {
                    memberId: criteria.memberId,
                });
            }

            if (criteria.incomeTypeId) {
                qb.andWhere('incomeType.id = :incomeTypeId', {
                    incomeTypeId: criteria.incomeTypeId,
                });
            }

            if (criteria.paymentMethodId) {
                qb.andWhere('paymentMethod.id = :paymentMethodId', {
                    paymentMethodId: criteria.paymentMethodId,
                });
            }

            if (criteria.registeredBy) {
                qb.andWhere('registeredBy.id = :registeredBy', {
                    registeredBy: criteria.registeredBy,
                });
            }

            if (criteria.dateFrom) {
                qb.andWhere('income.incomeDate >= :dateFrom', {
                    dateFrom: criteria.dateFrom,
                });
            }

            if (criteria.dateTo) {
                qb.andWhere('income.incomeDate <= :dateTo', {
                    dateTo: criteria.dateTo,
                });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'income', criteria.status);
            }
            Query.sortCriteria(qb, `income.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async create(createIncomeDto: CreateIncomeDto, userId: number): Promise<IncomeEntity> {
        try {
            const income = this.incomeRepository.create({
                amount: createIncomeDto.amount,

                incomeDate: createIncomeDto.incomeDate,

                referenceNumber: createIncomeDto.referenceNumber,

                observation: createIncomeDto.observation,

                member: {
                    id: createIncomeDto.memberId,
                } as MemberEntity,

                incomeType: {
                    id: createIncomeDto.incomeTypeId,
                } as IncomeTypeEntity,

                paymentMethod: {
                    id: createIncomeDto.paymentMethodId,
                } as PaymentMethodEntity,

                voucherFile: createIncomeDto.voucherFileId
                    ? ({
                          id: createIncomeDto.voucherFileId,
                      } as FileEntity)
                    : null,

                registeredBy: {
                    id: userId,
                } as UserEntity,
            });

            const saved = await this.incomeRepository.save(income);
            const result = await this.findById(saved.id);

            return result as IncomeEntity;
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
    async update(id: Income['id'], updateIncomeDto: UpdateIncomeDto): Promise<IncomeEntity> {
        try {
            const income = await this.incomeRepository.findOne({
                where: { id },
            });

            if (!income) {
                throw new Error('Income not found');
            }

            const data: Partial<IncomeEntity> = {
                id,
            };

            if (updateIncomeDto.amount !== undefined) {
                data.amount = updateIncomeDto.amount;
            }

            if (updateIncomeDto.incomeDate !== undefined) {
                data.incomeDate = updateIncomeDto.incomeDate;
            }

            if (updateIncomeDto.referenceNumber !== undefined) {
                data.referenceNumber = updateIncomeDto.referenceNumber;
            }

            if (updateIncomeDto.observation !== undefined) {
                data.observation = updateIncomeDto.observation;
            }

            if (updateIncomeDto.memberId !== undefined) {
                data.member = {
                    id: updateIncomeDto.memberId,
                } as MemberEntity;
            }

            if (updateIncomeDto.incomeTypeId !== undefined) {
                data.incomeType = {
                    id: updateIncomeDto.incomeTypeId,
                } as IncomeTypeEntity;
            }

            if (updateIncomeDto.paymentMethodId !== undefined) {
                data.paymentMethod = {
                    id: updateIncomeDto.paymentMethodId,
                } as PaymentMethodEntity;
            }

            if (updateIncomeDto.voucherFileId !== undefined) {
                data.voucherFile = updateIncomeDto.voucherFileId
                    ? ({
                          id: updateIncomeDto.voucherFileId,
                      } as FileEntity)
                    : null;
            }

            await this.incomeRepository.save(data);

            return (await this.findById(id)) as IncomeEntity;
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async softDelete(id: Income['id']): Promise<void> {
        try {
            await this.incomeRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async delete(id: Income['id']): Promise<void> {
        try {
            await this.incomeRepository.delete(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
    async restore(id: Income['id']): Promise<void> {
        try {
            await this.incomeRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
    async findByIdWithDeleted(id: Income['id']): Promise<IncomeEntity | null> {
        try {
            return await this.incomeRepository
                .createQueryBuilder('income')
                .withDeleted()

                .leftJoinAndSelect('income.voucherFile', 'voucherFile')

                .leftJoinAndSelect('income.member', 'member')

                .leftJoinAndSelect('income.incomeType', 'incomeType')

                .leftJoinAndSelect('income.paymentMethod', 'paymentMethod')

                .where('income.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async exportByCriteria(criteria: ExportIncomeCriteriaDto): Promise<IncomeEntity[]> {
        try {
            const qb = this.incomeRepository
                .createQueryBuilder('income')
                .leftJoinAndSelect('income.member', 'member')
                .leftJoinAndSelect('income.incomeType', 'incomeType')
                .leftJoinAndSelect('income.paymentMethod', 'paymentMethod')
                .leftJoinAndSelect('income.voucherFile', 'voucherFile')
                .leftJoinAndSelect('member.location', 'location')
                .leftJoinAndSelect('member.position', 'position')
                .leftJoinAndSelect('income.registeredBy', 'registeredBy')
                .leftJoinAndSelect('registeredBy.location', 'registeredByLocation')
                .leftJoinAndSelect('registeredBy.role', 'registeredByRole');

            if (criteria.memberId) {
                qb.andWhere('member.id = :memberId', { memberId: criteria.memberId });
            }

            if (criteria.incomeTypeId) {
                qb.andWhere('incomeType.id = :incomeTypeId', { incomeTypeId: criteria.incomeTypeId });
            }

            if (criteria.paymentMethodId) {
                qb.andWhere('paymentMethod.id = :paymentMethodId', { paymentMethodId: criteria.paymentMethodId });
            }

            if (criteria.registeredBy) {
                qb.andWhere('registeredBy.id = :registeredBy', { registeredBy: criteria.registeredBy });
            }

            if (criteria.dateFrom) {
                qb.andWhere('income.incomeDate >= :dateFrom', { dateFrom: criteria.dateFrom });
            }

            if (criteria.dateTo) {
                qb.andWhere('income.incomeDate <= :dateTo', { dateTo: criteria.dateTo });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'income', criteria.status);
            }

            const sortField = criteria.sortField || 'createdAt';
            const sortDirection = criteria.sortDirection || 'DESC';
            Query.sortCriteria(qb, `income.${sortField}`, sortDirection);

            // Sin paginación: trae todos los registros que cumplen los filtros
            return await qb.getMany();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
}
