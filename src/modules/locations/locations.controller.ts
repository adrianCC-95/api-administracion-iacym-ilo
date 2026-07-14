import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Put } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { FindLocationByyCriteriaDto } from './dto/find-location-by-criteria.dto';
import { LocationMapper } from './mappers/location.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';

@Controller('locations')
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindLocationByyCriteriaDto) {
        const locations = await this.locationsService.findByCriteria(query);
        return LocationMapper.toResponseList(locations);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const location = await this.locationsService.findById(id);
        if (!location) throw new ResourceNotFoundException('location', id);

        return LocationMapper.toResponse(location);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createLocationDto: CreateLocationDto) {
        const location = await this.locationsService.create(createLocationDto);
        return LocationMapper.toResponse(location);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() updateLocationDto: UpdateLocationDto) {
        const location = await this.locationsService.update(id, updateLocationDto);
        return LocationMapper.toResponse(location);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.locationsService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.locationsService.restore(id);
    }
}
