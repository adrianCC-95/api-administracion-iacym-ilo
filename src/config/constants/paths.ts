import { join } from 'path';
import { existsSync } from 'fs';

/**
 * Resuelve la ruta raíz del proyecto garantizando compatibilidad
 * tanto en desarrollo (src/) como en producción (dist/).
 */
const getRootPath = (): string => {
    const cwdPath = process.cwd();

    if (existsSync(join(cwdPath, 'public'))) {
        return cwdPath;
    }

    return join(__dirname, '..', '..');
};

export const ROOT_PATH = getRootPath();

/**
 * Directorio raíz de activos estáticos locales
 */
export const PUBLIC_PATH = join(ROOT_PATH, 'public');

/**
 * Subdirectorios dentro de /public
 */
export const PUBLIC_PATHS = {
    images: join(PUBLIC_PATH, 'images'),
};

/**
 * Nombres de archivos estáticos frecuentemente usados
 */
export const ASSETS = {
    companyLogo: 'eps-logo.png',
    logoPlanilla: 'planilla-logo.png',
};

/**
 * Helper para obtener la RUTA ABSOLUTA completa de una imagen
 * Ejemplo: getImagePath(ASSETS.logoPlanilla)
 */
export const getImagePath = (fileName: string): string => {
    return join(PUBLIC_PATHS.images, fileName);
};
