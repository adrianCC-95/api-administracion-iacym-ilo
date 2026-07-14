// src/utils/file-utils.ts
import { extname } from 'path';

/**
 * Returns the lowercase file extension (without the leading dot).
 * Example: "report.xlsx" → "xlsx"
 */
export function getFileExtension(filename: string): string {
    const ext = extname(filename);
    return ext ? ext.slice(1).toLowerCase() : '';
}
