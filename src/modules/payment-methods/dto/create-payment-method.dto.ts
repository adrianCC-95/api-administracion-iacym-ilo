import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePaymentMethodDto {
    @IsString()
    @MinLength(3)
    @MaxLength(100)
    name!: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(250)
    description?: string | null;
}
