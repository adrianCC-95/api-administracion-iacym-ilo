import { UserEntity } from '../../users/entities/user.entity';
import { UserBasicInfo } from '../models/auth.model';

export function createUserDisplayInfo(user: UserEntity): UserBasicInfo {
    return {
        name: user.name,
        role: user.role,
        location: user.location,
    } satisfies UserBasicInfo;
}
