import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateFileDto {
    originalName!: string;

    fileName!: string;

    extension!: string;

    mimeType!: string;

    path!: string;

    storage!: string;

    hash?: string;

    size!: number;
}
