import { BadRequestException, Controller, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { validationExistFile, validationMaxSize, validationTypes } from './utils/file-validations.util';

@Controller('storage')
export class StorageController {
    constructor(private readonly storageService: StorageService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File, @Query() query: UploadFileDto) {
        validationExistFile(file);

        validationMaxSize(file);
        validationTypes(file);

        return this.storageService.upload(file, query.folder);
    }
}
