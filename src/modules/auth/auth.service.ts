import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { AuthenticationException } from '../../common/exceptions/auth-exceptions';
import { verifyPassword } from '../../utils/credentials';
import { JwtService } from '@nestjs/jwt';
import { JwtExtData } from './models/auth.model';
import { UserEntity } from '../users/entities/user.entity';
import { createUserDisplayInfo } from './utils/auth.utils';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const user = await this.userService.findByUsername(loginDto.username);

        if (!user) throw new AuthenticationException('Invalid credentials');

        await this.validatePassword(loginDto.password, user.password);
        const accessToken = await this.createAccessToken(user);
        const userDisplayInfo = createUserDisplayInfo(user);

        return { accessToken, userInfo: userDisplayInfo };
    }

    private async validatePassword(plainPassword: string, hashedPassword: string): Promise<void> {
        const isPasswordValid = await verifyPassword(plainPassword, hashedPassword);

        if (!isPasswordValid) {
            throw new AuthenticationException('Invalid credentials');
        }
    }

    private async createAccessToken(user: UserEntity): Promise<string> {
        const extData = { userId: user.id, roleId: user.role.id } satisfies JwtExtData;
        return this.jwtService.signAsync(extData);
    }
}
