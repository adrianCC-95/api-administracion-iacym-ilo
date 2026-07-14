import { Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from '../exceptions/global-exception';
import { TransformResponseInterceptor } from '../interceptors/transform-response';

export const GlobalProviders = [
    {
        provide: APP_FILTER,
        useClass: GlobalExceptionFilter,
    },
    {
        provide: APP_INTERCEPTOR,
        useClass: TransformResponseInterceptor,
    },
] satisfies Provider[];
