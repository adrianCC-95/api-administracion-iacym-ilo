import { Injectable } from '@nestjs/common';
import { FilesService } from '../files/files.service';
import { StorageFolder } from './enums/storage-folder.enum';
import path from 'path';
import fs from 'fs';
import { generateFileName } from './utils/file-name.util';
import { createSHA256 } from './utils/hash.util';
import { CreateFileDto } from '../files/dto/create-file.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
    constructor(
        private readonly filesService: FilesService,
        private readonly configService: ConfigService,
    ) {}
    private getBasePath(): string {
        const path = this.configService.get<string>('storage.storagePath');

        if (!path) {
            throw new Error('STORAGE_FOLDER_PATH no configurado');
        }

        return path;
    }
    async upload(file: Express.Multer.File, folder: StorageFolder) {
        try {
            const now = new Date();

            const year = now.getFullYear().toString();

            const month = String(now.getMonth() + 1).padStart(2, '0');
            const relativeFolder = path.posix.join(folder, year, month);
            const uploadPath = path.join(process.cwd(), this.getBasePath(), folder, year, month);
            if (!fs.existsSync(uploadPath)) {
                fs.mkdirSync(uploadPath, {
                    recursive: true,
                });
            }
            const fileName = generateFileName(file.originalname);
            const fullPath = path.join(uploadPath, fileName);
            await fs.promises.writeFile(fullPath, file.buffer);
            const hash = createSHA256(file.buffer);
            const dto: CreateFileDto = {
                originalName: file.originalname,

                fileName,

                extension: path.extname(file.originalname),

                mimeType: file.mimetype,

                // Ruta para guardar en BD
                path: path.posix.join(relativeFolder, fileName),

                storage: 'local',

                hash,

                size: file.size,
            };
            const savedFile = await this.filesService.create(dto);
            return savedFile;
        } catch (error) {
            console.log(error);

            throw error;
        }
    }
}
