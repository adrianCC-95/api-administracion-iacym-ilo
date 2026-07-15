import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';

import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { FindPositionByCriteriaDto } from './dto/find-position-by-criteria';

import { PositionMapper } from './mappers/position.mapper';

import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';

@Controller('positions')
export class PositionsController {
    constructor(private readonly positionsService: PositionsService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindPositionByCriteriaDto) {
        const positions = await this.positionsService.findByCriteria(query);
        return PositionMapper.toResponseList(positions);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const position = await this.positionsService.findById(id);

        if (!position) {
            throw new ResourceNotFoundException('position', id);
        }

        return PositionMapper.toResponse(position);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() dto: CreatePositionDto) {
        const position = await this.positionsService.create(dto);
        return PositionMapper.toResponse(position);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() dto: UpdatePositionDto) {
        const position = await this.positionsService.update(id, dto);
        return PositionMapper.toResponse(position);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return this.positionsService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return this.positionsService.restore(id);
    }
}
