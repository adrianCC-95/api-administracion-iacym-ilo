import { IsEnum } from 'class-validator';
import { StorageFolder } from '../enums/storage-folder.enum';

export class UploadFileDto {
    @IsEnum(StorageFolder)
    folder!: StorageFolder;
}
