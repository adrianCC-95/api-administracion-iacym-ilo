import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from '../../../config/env/env.config';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            useFactory: () => ({
                signOptions: { expiresIn: envConfig().jwt.expTime },
                secret: envConfig().jwt.secret,
            }),
        }),
    ],
    exports: [JwtModule],
})
export class JwtAuthModule {}
