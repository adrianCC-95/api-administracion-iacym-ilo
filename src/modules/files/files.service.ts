import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileRepositoryImpl } from './repositories/file.repository.impl';
import { FindFileByCriteriaDto } from './dto/find-file-by-criteria';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { FileMapper } from './mappers/file.mapper';
import { File } from './models/file.model';
import { ResourceNotFoundException } from 'src/common/exceptions/not-found-exception';

@Injectable()
export class FilesService {
    constructor(private readonly filesRepository: FileRepositoryImpl) {}

    async findById(id: File['id']) {
        const entity = await this.filesRepository.findById(id);
        return entity ? FileMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindFileByCriteriaDto) {
        const entities = await this.filesRepository.findByCriteria(criteria);
        return FileMapper.toDomainList(entities);
    }

    async create(createFileDto: CreateFileDto) {
        const newFile = await this.filesRepository.create(createFileDto);
        return FileMapper.toDomain(newFile);
    }

    async update(id: File['id'], updateFileDto: UpdateFileDto) {
        const updatedFile = await this.filesRepository.update(id, updateFileDto);
        return FileMapper.toDomain(updatedFile);
    }

    async softDelete(id: File['id']) {
        const file = await this.findById(id);

        if (!file) throw new DuplicateException('file', id);

        return await this.filesRepository.softDelete(id);
    }

    async delete(id: File['id']) {
        const file = await this.findById(id);

        if (!file) {
            throw new ResourceNotFoundException('File', id);
        }

        await this.filesRepository.delete(id);
    }

    async restore(id: File['id']) {
        return await this.filesRepository.restore(id);
    }
}
