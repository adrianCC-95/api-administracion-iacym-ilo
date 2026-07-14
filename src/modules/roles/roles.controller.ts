import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Req,
    Res,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RolesService } from './roles.service';
import { FindRoleByCriteriaDto } from './dto/find-role-by-criteria';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { RoleMapper } from './mappers/role.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';
import { Request, Response } from 'express';
import { ValidationException } from '../../common/exceptions/validation-exception';

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindRoleByCriteriaDto) {
        const roles = await this.rolesService.findByCriteria(query);
        return RoleMapper.toResponseList(roles);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const role = await this.rolesService.findById(id);
        if (!role) throw new ResourceNotFoundException('role', id);
        return RoleMapper.toResponse(role);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createRoleDto: CreateRoleDto) {
        const role = await this.rolesService.create(createRoleDto);
        return RoleMapper.toResponse(role);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() updateRoleDto: UpdateRoleDto) {
        const role = await this.rolesService.update(id, updateRoleDto);
        return RoleMapper.toResponse(role);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.rolesService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.rolesService.restore(id);
    }
}
