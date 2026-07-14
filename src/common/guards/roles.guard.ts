import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../config/constants/tokens';
import { Request } from 'express';
import { AuthenticationException } from '../exceptions/auth-exceptions';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest<Request>();

        if (!user) throw new AuthenticationException();

        const shouldPass = requiredRoles.includes(user.roleName);

        if (!shouldPass) throw new AuthenticationException('Insufficient role');

        return true;
    }
}
