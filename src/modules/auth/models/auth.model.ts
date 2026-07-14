import type { JwtPayload } from 'jsonwebtoken';
import { UserEntity } from '../../users/entities/user.entity';

export type UserBasicInfo = Pick<UserEntity, 'name' | 'role' | 'location'>;

export type JwtExtData = {
    userId: number;
    roleId: number;
};

export type JwtPayloadExtended = JwtExtData & JwtPayload;
