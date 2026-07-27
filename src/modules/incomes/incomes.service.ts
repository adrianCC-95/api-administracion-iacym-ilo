import { StorageService } from './../storage/storage.service';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeRepositoryImpl } from './repositories/income.repository.impl';
import { FindIncomeByCriteriaDto } from './dto/find-income-by-criteria';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { IncomeMapper } from './mappers/income.mapper';
import { Income } from './models/income.model';
import { MembersService } from '../members/members.service';
import { IncomeTypesService } from '../income-types/income-types.service';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { FilesService } from '../files/files.service';
import { StorageFolder } from '../storage/enums/storage-folder.enum';
import { IncomeExcelService } from './services/income-excel.service';
import { ExportIncomeCriteriaDto } from './dto/export-income-criteria.dto';

@Injectable()
export class IncomesService {
    constructor(
        private readonly incomesRepository: IncomeRepositoryImpl,
        private readonly membersService: MembersService,
        private readonly incomeTypesService: IncomeTypesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly filesService: FilesService,
        private readonly storageService: StorageService,
        private readonly incomeExcelService: IncomeExcelService,
    ) {}

    async findById(id: Income['id']) {
        const entity = await this.incomesRepository.findById(id);
        return entity ? IncomeMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindIncomeByCriteriaDto) {
        const entities = await this.incomesRepository.findByCriteria(criteria);
        return IncomeMapper.toDomainList(entities);
    }

    async create(createIncomeDto: CreateIncomeDto, voucher: Express.Multer.File | undefined, userId: number) {
        const member = await this.membersService.findById(createIncomeDto.memberId);

        if (!member) {
            throw new ResourceNotFoundException('Member', createIncomeDto.memberId);
        }

        const incomeType = await this.incomeTypesService.findById(createIncomeDto.incomeTypeId);

        if (!incomeType) {
            throw new ResourceNotFoundException('Income Type', createIncomeDto.incomeTypeId);
        }

        const paymentMethod = await this.paymentMethodsService.findById(createIncomeDto.paymentMethodId);

        if (!paymentMethod) {
            throw new ResourceNotFoundException('Payment Method', createIncomeDto.paymentMethodId);
        }

        let fileId: number | null = null;

        if (voucher) {
            const storedFile = await this.storageService.upload(voucher, StorageFolder.INCOMES);

            fileId = storedFile.id;
            createIncomeDto.voucherFileId = fileId;
        }

        const newIncome = await this.incomesRepository.create(createIncomeDto, userId);
        return IncomeMapper.toDomain(newIncome);
    }

    async update(id: Income['id'], voucher: Express.Multer.File | undefined, updateIncomeDto: UpdateIncomeDto) {
        const income = await this.findById(id);

        if (!income) {
            throw new ResourceNotFoundException('Income', id);
        }

        if (updateIncomeDto.memberId !== undefined) {
            const member = await this.membersService.findById(updateIncomeDto.memberId);

            if (!member) {
                throw new ResourceNotFoundException('Member', updateIncomeDto.memberId);
            }
        }

        if (updateIncomeDto.incomeTypeId !== undefined) {
            const incomeType = await this.incomeTypesService.findById(updateIncomeDto.incomeTypeId);

            if (!incomeType) {
                throw new ResourceNotFoundException('Income Type', updateIncomeDto.incomeTypeId);
            }
        }

        if (updateIncomeDto.paymentMethodId !== undefined) {
            const paymentMethod = await this.paymentMethodsService.findById(updateIncomeDto.paymentMethodId);

            if (!paymentMethod) {
                throw new ResourceNotFoundException('Payment Method', updateIncomeDto.paymentMethodId);
            }
        }

        if (voucher) {
            const storedFile = await this.storageService.upload(voucher, StorageFolder.INCOMES);

            updateIncomeDto.voucherFileId = storedFile.id;
        }

        const updatedIncome = await this.incomesRepository.update(id, updateIncomeDto);

        return IncomeMapper.toDomain(updatedIncome);
    }

    async softDelete(id: Income['id']) {
        const income = await this.findById(id);

        if (!income) {
            throw new ResourceNotFoundException('Income', id);
        }

        await this.incomesRepository.softDelete(id);

        if (income.voucherFile) {
            await this.filesService.softDelete(income.voucherFile.id);
        }

        return {
            message: 'Income eliminado correctamente',
        };
    }

    async delete(id: Income['id']) {
        const income = await this.findById(id);

        if (!income) {
            throw new ResourceNotFoundException('Income', id);
        }

        const voucherFile = income.voucherFile;

        await this.incomesRepository.delete(id);

        if (voucherFile) {
            await this.filesService.delete(voucherFile.id);
        }

        if (voucherFile) {
            await this.storageService.delete(voucherFile.path);
        }

        return {
            message: 'Income eliminado correctamente',
        };
    }

    async restore(id: Income['id']) {
        const income = await this.incomesRepository.findByIdWithDeleted(id);

        if (!income) {
            throw new ResourceNotFoundException('Income', id);
        }

        const member = await this.membersService.findByIdWithDeleted(income.member.id);

        if (!member) {
            throw new ResourceNotFoundException('Member', income.member.id);
        }

        const incomeType = await this.incomeTypesService.findByIdWithDeleted(income.incomeType.id);

        if (!incomeType) {
            throw new ResourceNotFoundException('Income Type', income.incomeType.id);
        }

        const paymentMethod = await this.paymentMethodsService.findByIdWithDeleted(income.paymentMethod.id);

        if (!paymentMethod) {
            throw new ResourceNotFoundException('Payment Method', income.paymentMethod.id);
        }

        await this.incomesRepository.restore(id);

        if (income.voucherFile) {
            await this.filesService.restore(income.voucherFile.id);
        }

        return {
            message: 'Income restaurado correctamente',
        };
    }
    async export(criteria: ExportIncomeCriteriaDto, res: Response): Promise<void> {
        const entities = await this.incomesRepository.exportByCriteria(criteria);
        const incomes = entities.map((entity) => IncomeMapper.toDomain(entity));

        await this.incomeExcelService.generateExcelResponse(incomes, criteria, res);
    }
}
