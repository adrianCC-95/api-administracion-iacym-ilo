import { EnvironmentMode } from '../../utils/enums/env';

const getEnv = (key: string): string | undefined => process.env[key];

export const StringValidation = {
    required: (key: string) => {
        const value = getEnv(key);
        if (typeof value === 'string') return value;

        throw new Error(`[ENV]: Variable ${key} is not defined`);
    },
    optional: (key: string) => {
        const value = getEnv(key);

        if (typeof value === 'string' && value !== '') return value;

        return undefined;
    },
    urls: (key: string) => {
        const value = getEnv(key);

        if (!value) {
            throw new Error(`[ENV]: Variable ${key} is not defined`);
        }

        return value.split(',').map((raw) => {
            const trimmed = raw.trim();

            try {
                const parsed = new URL(trimmed);
                parsed.hostname = parsed.hostname.toLowerCase();

                if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
                    throw new Error(`[ENV]: Only http and https are allowed in ${key}: ${raw}`);
                }

                return parsed.origin;
            } catch (err) {
                throw err;
            }
        });
    },
};

export const NumberValidation = {
    required: (key: string): number => {
        const value = getEnv(key);
        if (!value) throw new Error(`[ENV]: Missing value for ${key}`);

        const parsed = parseInt(value, 10);
        if (!Number.isNaN(parsed)) return parsed;

        throw new Error(`[ENV]: Invalid number format for ${key}`);
    },
    optional: (key: string): number | undefined => {
        const value = getEnv(key);
        if (typeof value !== 'string') {
            //console.log(`[ENV]: Variable ${key} (OPTIONAL) is not defined`);
            return undefined;
        }

        const parsed = parseInt(value, 10);
        if (!Number.isNaN(parsed)) return parsed;

        return undefined;
    },
};

export const EnvValidation = {
    envMode: (key: string): EnvironmentMode => {
        const value = getEnv(key);
        if (value !== EnvironmentMode.DEVELOPMENT && value !== EnvironmentMode.PRODUCTION) {
            throw new Error(`[ENV]: Variable ${key} is not either ${Object.values(EnvironmentMode).join(' or ')}`);
        }
        return value;
    },
};
