import { File, FileResponse } from '../models/file.model';
import { FileEntity } from '../entities/file.entity';
import { PaginatedResult } from '../../../types/pagination';
import { mapPaginated } from '../../../utils/pagination';
import { getFileUrl } from '../../../utils/file-url.util';

export class FileMapper {
    static toDomain(entity: FileEntity): File {
        const file = new File();

        file.id = entity.id;

        file.originalName = entity.originalName;

        file.fileName = entity.fileName;

        file.extension = entity.extension;

        file.mimeType = entity.mimeType;

        file.path = entity.path;

        file.storage = entity.storage;

        file.hash = entity.hash || null;

        file.size = Number(entity.size);

        file.createdAt = entity.createdAt;

        file.updatedAt = entity.updatedAt;

        file.deletedAt = entity.deletedAt;

        return file;
    }

    static toDomainList(entities: PaginatedResult<FileEntity>) {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(file: File) {
        const response = new FileResponse();

        response.id = file.id;

        response.originalName = file.originalName;

        response.path = file.path;
        response.url = getFileUrl(file.path);
        response.size = file.size;

        response.mimeType = file.mimeType;

        response.createdAt = file.createdAt;

        response.isDeleted = file.deletedAt !== null;

        return response;
    }

    static toResponseList(list: PaginatedResult<File>) {
        return mapPaginated(list, this.toResponse);
    }
}
