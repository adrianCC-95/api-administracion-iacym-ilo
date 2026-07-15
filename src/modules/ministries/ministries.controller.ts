import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateMinistryDto } from './dto/create-ministry.dto';
import { UpdateMinistryDto } from './dto/update-ministry.dto';
import { MinistriesService } from './ministries.service';
import { FindMinistryByCriteriaDto } from './dto/find-ministry-by-criteria';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { MinistryMapper } from './mappers/ministry.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';

@Controller('ministries')
export class MinistriesController {
    constructor(private readonly ministriesService: MinistriesService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindMinistryByCriteriaDto) {
        const ministries = await this.ministriesService.findByCriteria(query);
        return MinistryMapper.toResponseList(ministries);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const ministry = await this.ministriesService.findById(id);
        if (!ministry) throw new ResourceNotFoundException('ministry', id);
        return MinistryMapper.toResponse(ministry);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createMinistryDto: CreateMinistryDto) {
        const ministry = await this.ministriesService.create(createMinistryDto);
        return MinistryMapper.toResponse(ministry);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() updateMinistryDto: UpdateMinistryDto) {
        const ministry = await this.ministriesService.update(id, updateMinistryDto);
        return MinistryMapper.toResponse(ministry);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.ministriesService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.ministriesService.restore(id);
    }
}
