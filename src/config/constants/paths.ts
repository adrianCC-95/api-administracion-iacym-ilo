// src/config/paths.ts
import { join } from 'path';
import { cwd } from 'process';

/**
 * Always points to your project root, regardless of where the code runs.
 */
export const ROOT_PATH = cwd();

/**
 * Points to your static local assets (not exposed via URL).
 */
export const PUBLIC_PATH = join(ROOT_PATH, 'public');

/**
 * Subdirectories under /public
 */
export const PUBLIC_PATHS = {
    images: join(PUBLIC_PATH, 'images'),
};

/**
 * Commonly used asset filenames.
 * Define them once, use them everywhere.
 */
export const ASSETS = {
    companyLogo: 'eps-logo.png',
};
