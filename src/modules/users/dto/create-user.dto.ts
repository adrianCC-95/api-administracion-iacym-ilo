import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { IsId } from '../../../common/decorators/is-id';
import { REGEX } from '../../../utils/regex';
import { toTrim } from '../../../utils/transformers';

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @Transform(({ value }) => toTrim(value))
    @IsString()
    @MinLength(4)
    @MaxLength(24)
    @Matches(REGEX.USERNAME_SAFE_CHARS, {
        message: 'username can only contain lowercase letters, numbers, and dots',
    })
    username: string;

    @IsString()
    @MinLength(6)
    @MaxLength(24)
    password: string;

    @IsOptional()
    @IsId()
    locationId?: number | null;

    @IsId()
    roleId: number;
}
