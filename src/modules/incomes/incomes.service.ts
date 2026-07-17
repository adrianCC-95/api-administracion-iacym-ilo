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
        // valida la existencia de miembro
        const member = await this.membersService.findById(createIncomeDto.memberId);

        if (!member) {
            throw new ResourceNotFoundException('Member', createIncomeDto.memberId);
        }

        // valida la existencia de tipo de ingreso
        const incomeType = await this.incomeTypesService.findById(createIncomeDto.incomeTypeId);

        if (!incomeType) {
            throw new ResourceNotFoundException('Income Type', createIncomeDto.incomeTypeId);
        }
        // valida la existencia de metodo de pago
        const paymentMethod = await this.paymentMethodsService.findById(createIncomeDto.paymentMethodId);

        if (!paymentMethod) {
            throw new ResourceNotFoundException('Payment Method', createIncomeDto.paymentMethodId);
        }
        // valida la existencia de voucher
        let fileId: number | null = null;

        if (voucher) {
            // Guarda el archivo físicamente
            const storedFile = await this.storageService.upload(voucher, StorageFolder.INCOMES);

            // Guarda la metadata en la BD

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

        // validar member solo si viene
        if (updateIncomeDto.memberId !== undefined) {
            const member = await this.membersService.findById(updateIncomeDto.memberId);

            if (!member) {
                throw new ResourceNotFoundException('Member', updateIncomeDto.memberId);
            }
        }

        // validar incomeType solo si viene
        if (updateIncomeDto.incomeTypeId !== undefined) {
            const incomeType = await this.incomeTypesService.findById(updateIncomeDto.incomeTypeId);

            if (!incomeType) {
                throw new ResourceNotFoundException('Income Type', updateIncomeDto.incomeTypeId);
            }
        }

        // validar paymentMethod solo si viene
        if (updateIncomeDto.paymentMethodId !== undefined) {
            const paymentMethod = await this.paymentMethodsService.findById(updateIncomeDto.paymentMethodId);

            if (!paymentMethod) {
                throw new ResourceNotFoundException('Payment Method', updateIncomeDto.paymentMethodId);
            }
        }

        // nuevo voucher
        if (voucher) {
            const storedFile = await this.storageService.upload(voucher, StorageFolder.INCOMES);

            updateIncomeDto.voucherFileId = storedFile.id;
        }

        const updatedIncome = await this.incomesRepository.update(id, updateIncomeDto);

        return IncomeMapper.toDomain(updatedIncome);
    }
    // async update(id: Income['id'], voucher: Express.Multer.File | undefined, updateIncomeDto: UpdateIncomeDto) {
    //     console.log(updateIncomeDto);
    //     // valida la existencia de miembro
    //     const member = await this.membersService.findById(updateIncomeDto.memberId as number);

    //     if (!member) {
    //         throw new ResourceNotFoundException('Member', updateIncomeDto.memberId);
    //     }

    //     // valida la existencia de tipo de ingreso
    //     const incomeType = await this.incomeTypesService.findById(updateIncomeDto.incomeTypeId as number);

    //     if (!incomeType) {
    //         throw new ResourceNotFoundException('Income Type', updateIncomeDto.incomeTypeId);
    //     }
    //     // valida la existencia de metodo de pago
    //     const paymentMethod = await this.paymentMethodsService.findById(updateIncomeDto.paymentMethodId as number);

    //     if (!paymentMethod) {
    //         throw new ResourceNotFoundException('Payment Method', updateIncomeDto.paymentMethodId);
    //     }

    //     // valida la existencia de voucher, en caso que exista lo reemplaza
    //     if (voucher) {
    //         console.log('si hay voucher en editar');
    //         const storedFile = await this.storageService.upload(voucher, StorageFolder.INCOMES);
    //         console.log('id file editar nuevo', storedFile);
    //         updateIncomeDto.voucherFileId = storedFile.id;
    //     }
    //     const updatedIncome = await this.incomesRepository.update(id, updateIncomeDto);
    //     return IncomeMapper.toDomain(updatedIncome);
    // }

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

        // 1. eliminar income
        await this.incomesRepository.delete(id);

        // 2. eliminar metadata
        if (voucherFile) {
            await this.filesService.delete(voucherFile.id);
        }

        // 3. eliminar archivo físico
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

        // Validar Member
        const member = await this.membersService.findByIdWithDeleted(income.member.id);

        if (!member) {
            throw new ResourceNotFoundException('Member', income.member.id);
        }

        // Validar IncomeType
        const incomeType = await this.incomeTypesService.findByIdWithDeleted(income.incomeType.id);

        if (!incomeType) {
            throw new ResourceNotFoundException('Income Type', income.incomeType.id);
        }

        // Validar PaymentMethod
        const paymentMethod = await this.paymentMethodsService.findByIdWithDeleted(income.paymentMethod.id);

        if (!paymentMethod) {
            throw new ResourceNotFoundException('Payment Method', income.paymentMethod.id);
        }

        // Restaurar Income
        await this.incomesRepository.restore(id);

        // Restaurar metadata del archivo
        if (income.voucherFile) {
            await this.filesService.restore(income.voucherFile.id);
        }

        return {
            message: 'Income restaurado correctamente',
        };
    }
}
