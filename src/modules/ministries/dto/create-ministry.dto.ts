import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMinistryDto {
    @IsString()
    @MinLength(5)
    @MaxLength(250)
    name!: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(500)
    description?: string | null;
}
