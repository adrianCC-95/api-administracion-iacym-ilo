import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { isProdEnv } from '../../utils/env';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = exception instanceof HttpException ? exception.getResponse() : 'INTERNAL_SERVER_ERROR';

        const devResponse = {
            code: errorResponse['errorCode'],
            message: errorResponse['error'],
            details: {
                reason: errorResponse['message'],
                stack: exception?.['stack'],
            },
        };

        const prodResponse = {
            code: errorResponse['errorCode'] ?? null,
            message: errorResponse['message'] ?? null,
        };

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error: isProdEnv() ? prodResponse : devResponse,
        });
    }
}
