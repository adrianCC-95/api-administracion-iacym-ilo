import { EnvValidation, NumberValidation, StringValidation } from './env-utils';

export const envConfig = () =>
    Object.freeze({
        app: {
            port: NumberValidation.required('PORT'),
            envMode: EnvValidation.envMode('ENV_MODE'),
            apiPrefix: StringValidation.optional('APP_PREFIX'),
            allowedDomains: StringValidation.urls('ALLOWED_DOMAINS'),
            appUrl: StringValidation.required('APP_URL'),
        },
        allowedDomains: StringValidation.optional('ALLOWED_DOMAINS'),
        database: {
            type: StringValidation.required('DATABASE_TYPE'),
            host: StringValidation.required('DATABASE_HOST'),
            port: NumberValidation.required('DATABASE_PORT'),
            username: StringValidation.required('DATABASE_USERNAME'),
            password: StringValidation.required('DATABASE_PASSWORD'),
            name: StringValidation.required('DATABASE_NAME'),
            maxConnections: NumberValidation.optional('DATABASE_MAX_CONNECTIONS'),
        },
        jwt: {
            secret: StringValidation.required('JWT_SECRET'),
            expTime: StringValidation.required('JWT_EXPIRATION_TIME'),
        },
        storage: {
            maxFileSize: NumberValidation.required('MAX_UPLOAD_SIZE'),
            storageDriver: StringValidation.required('STORAGE_DRIVER'),
            storagePath: StringValidation.required('STORAGE_FOLDER_PATH'),
            publicPath: StringValidation.required('STORAGE_PUBLIC_PATH'),
        },
    });
