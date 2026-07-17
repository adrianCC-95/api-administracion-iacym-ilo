import { envConfig } from 'src/config/env/env.config';

// export function getFileUrl(filePath: string): string {
//     if (!filePath) return '';
//     const path = envConfig().storage.uploadPath;
//     return `${path}/${filePath.replace(/\\/g, '/')}`;
// }

export function getFileUrl(path: string): string {
    const baseUrl = envConfig().app.appUrl;
    const pathFolder = envConfig().storage.storagePath;

    return `${baseUrl}/${pathFolder}/${path.replace(/\\/g, '/')}`;
}
