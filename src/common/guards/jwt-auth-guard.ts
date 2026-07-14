import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../modules/users/models/user.model';
import { AuthenticationException } from '../exceptions/auth-exceptions';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err: any, user: User, info: any, context: any, status: any) {
        if (!user) {
            throw new AuthenticationException();
        }

        return super.handleRequest(err, user, info, context, status);
    }
}
