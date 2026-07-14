import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import type { Request } from 'express';

interface Response<T> {
    data: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const now = Date.now();
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest<Request>();
        return next.handle().pipe(
            map((data) => ({
                ok: true,
                message: 'Successful Request',
                path: request.path,
                duration: `${Date.now() - now}ms`,
                method: request.method,
                data: typeof data !== 'undefined' ? data : null,
            })),
        );
    }
}
