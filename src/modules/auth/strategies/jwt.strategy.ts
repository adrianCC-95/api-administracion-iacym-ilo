import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { envConfig } from '../../../config/env/env.config';
import { JwtPayloadExtended } from '../models/auth.model';
import { AuthSession, User } from '../../users/models/user.model';
import { ResourceNotFoundException } from '../../../common/exceptions/not-found-exception';
import { AuthenticationException } from '../../../common/exceptions/auth-exceptions';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: envConfig().jwt.secret,
        });
    }

    async validate(payload: JwtPayloadExtended | null): Promise<AuthSession> {
        const userId = payload?.userId;

        if (!userId) throw new AuthenticationException();

        const user = await this.userService.findById(userId);

        if (!user) throw new ResourceNotFoundException('user', userId);

        return this.getAuthSession(user);
    }

    private getAuthSession(user: User): AuthSession {
        return {
            id: user.id,
            name: user.name,
            roleId: user.role.id,
            roleName: user.role.name,
            locationId: user.location?.id ?? null,
        };
    }
}
