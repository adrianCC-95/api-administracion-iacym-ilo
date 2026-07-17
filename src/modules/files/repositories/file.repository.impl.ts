import { PaginatedResult } from '../../../types/pagination';
import { CreateFileDto } from '../dto/create-file.dto';
import { FindFileByCriteriaDto } from '../dto/find-file-by-criteria';
import { UpdateFileDto } from '../dto/update-file.dto';
import { FileEntity } from '../entities/file.entity';
import { File } from '../models/file.model';

export abstract class FileRepositoryImpl {
    abstract create(dto: CreateFileDto): Promise<FileEntity>;

    abstract findById(id: File['id']): Promise<FileEntity | null>;

    abstract findByCriteria(criteria: FindFileByCriteriaDto): Promise<PaginatedResult<FileEntity>>;

    abstract update(id: File['id'], dto: UpdateFileDto): Promise<FileEntity>;

    abstract softDelete(id: File['id']): Promise<void>;

    abstract delete(id: File['id']): Promise<void>;

    abstract restore(id: File['id']): Promise<void>;
}
