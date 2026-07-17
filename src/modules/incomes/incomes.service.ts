import { StorageService } from './../storage/storage.service';
import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomeRepositoryImpl } from './repositories/income.repository.impl';
import { FindIncomeByCriteriaDto } from './dto/find-income-by-criteria';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { IncomeMapper } from './mappers/income.mapper';
import { Income } from './models/income.model';
import { MembersService } from '../members/members.service';
import { IncomeTypesService } from '../income-types/income-types.service';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { FilesService } from '../files/files.service';
import { StorageFolder } from '../storage/enums/storage-folder.enum';

@Injectable()
export class IncomesService {
    constructor(
        private readonly incomesRepository: IncomeRepositoryImpl,
        private readonly membersService: MembersService,
        private readonly incomeTypesService: IncomeTypesService,
        private readonly paymentMethodsService: PaymentMethodsService,
        private readonly filesService: FilesService,
        private readonly storageService: StorageService,
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
            // Guarda el archivo físicamente
            const storedFile = await this.storageService.upload(voucher, StorageFolder.INCOMES);

            // Guarda la metadata en la BD

            fileId = storedFile.id;
            createIncomeDto.voucherFileId = fileId;
        }

        console.log('fileId', fileId);

        const newIncome = await this.incomesRepository.create(createIncomeDto, userId);
        return IncomeMapper.toDomain(newIncome);
    }

    async update(id: Income['id'], updateIncomeDto: UpdateIncomeDto) {
        const updatedIncome = await this.incomesRepository.update(id, updateIncomeDto);
        return IncomeMapper.toDomain(updatedIncome);
    }

    async softDelete(id: Income['id']) {
        const income = await this.findById(id);

        if (!income) throw new DuplicateException('income', id);

        return await this.incomesRepository.softDelete(id);
    }

    async restore(id: Income['id']) {
        return await this.incomesRepository.restore(id);
    }
}
