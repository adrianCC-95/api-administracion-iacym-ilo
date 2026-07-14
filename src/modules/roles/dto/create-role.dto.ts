import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(250)
    description?: string | null;
}
