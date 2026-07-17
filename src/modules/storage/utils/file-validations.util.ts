import { BadRequestException } from '@nestjs/common';
import { envConfig } from '../../../config/env/env.config';

export function validationExistFile(file: Express.Multer.File) {
    if (!file) {
        throw new BadRequestException('Debe enviar un archivo.');
    }
}

// export function validationFile(file: Express.Multer.File) {
//     if (file.mimetype !== 'application/pdf') {
//         throw new BadRequestException('El archivo debe ser PDF.');
//     }
// }
export function validationMaxSize(file: Express.Multer.File) {
    const MAX_SIZE = envConfig().storage.maxFileSize;

    if (file.size > MAX_SIZE) {
        throw new BadRequestException('El archivo supera los 10 MB.');
    }
}

export function validationTypes(file: Express.Multer.File) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException('Tipo de archivo no permitido.');
    }
}
