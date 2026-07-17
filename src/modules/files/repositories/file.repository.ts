import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';
import { FileEntity } from '../entities/file.entity';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { File } from '../models/file.model';
import { FileRepositoryImpl } from './file.repository.impl';
import { FindFileByCriteriaDto } from '../dto/find-file-by-criteria';

@Injectable()
export class FileRepository implements FileRepositoryImpl {
    constructor(
        @InjectRepository(FileEntity)
        private readonly repository: Repository<FileEntity>,
    ) {}

    async findById(id: number) {
        try {
            return await this.repository.createQueryBuilder('file').where('file.id=:id', { id }).getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByCriteria(criteria: FindFileByCriteriaDto): Promise<PaginatedResult<FileEntity>> {
        try {
            const qb = this.repository.createQueryBuilder('file');

            if (criteria.originalName) {
                qb.andWhere('file.original_name LIKE :name', {
                    name: `%${criteria.originalName}%`,
                });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'file', criteria.status);
            }

            Query.sortCriteria(qb, `file.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async create(dto: CreateFileDto): Promise<FileEntity> {
        try {
            const entity = this.repository.create(dto);

            return await this.repository.save(entity);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async update(id: File['id'], updateFileDto: UpdateFileDto): Promise<FileEntity> {
        try {
            const updated = await this.repository.save({
                id,
                ...updateFileDto,
            });

            return (await this.findById(updated.id))!;
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async softDelete(id: File['id']): Promise<void> {
        try {
            await this.repository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async delete(id: File['id']): Promise<void> {
        try {
            await this.repository.delete(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
    async restore(id: File['id']): Promise<void> {
        try {
            await this.repository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
}
