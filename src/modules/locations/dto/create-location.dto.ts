import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateLocationDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(250)
    description?: string | null;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    address?: string | null;
}
