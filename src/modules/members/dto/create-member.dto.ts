import { IsDateString, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { IsId } from 'src/common/decorators/is-id';

export class CreateMemberDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    lastName!: string;

    @IsDateString()
    birthDate!: Date;

    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    phone!: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    address!: string;

    @IsId()
    locationId!: number;

    @IsId()
    positionId!: number;

    @IsOptional()
    @IsInt({ each: true })
    ministryIds?: number[];
}
