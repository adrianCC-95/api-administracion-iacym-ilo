import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ActionTypes } from '../models/acitivity-log';
import { Tables } from '../../../config/constants/tables';

export class CreateActivityLogDto {
    @IsInt()
    @IsNotEmpty()
    authorId: number;

    @IsString()
    @IsNotEmpty()
    authorName: string;

    @IsString()
    @IsNotEmpty()
    authorRole: string;

    @IsInt()
    @IsNotEmpty()
    targetId: number;

    @IsEnum(Tables)
    targetTable: Tables;

    @IsEnum(ActionTypes)
    actionType: ActionTypes;

    @IsOptional()
    beforeData?: Record<string, any>;

    @IsOptional()
    afterData?: Record<string, any>;
}
