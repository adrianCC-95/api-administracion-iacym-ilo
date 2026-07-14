import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
    Put,
    Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserByCriteriaDto } from './dto/find-user-by-criteria.dto';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserMapper } from './mappers/user.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { Request } from 'express';
import { RequireAuth } from '../../common/decorators/require-auth';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Req() req: Request, @Query() query: FindUserByCriteriaDto) {
        const users = await this.usersService.findByCriteria(query);
        return UserMapper.toResponseList(users);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const user = await this.usersService.findById(id);

        if (!user) throw new ResourceNotFoundException('user', id);

        return UserMapper.toResponse(user);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        const user = await this.usersService.create(createUserDto);
        return UserMapper.toResponse(user);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
        const user = await this.usersService.update(id, updateUserDto);
        return UserMapper.toResponse(user);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.usersService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.usersService.restore(id);
    }
}
