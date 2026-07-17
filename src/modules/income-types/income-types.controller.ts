import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateIncomeTypeDto } from './dto/create-income-type.dto';
import { UpdateIncomeTypeDto } from './dto/update-income-type.dto';
import { IncomeTypesService } from './income-types.service';
import { FindIncomeTypeByCriteriaDto } from './dto/find-income-type-by-criteria';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { IncomeTypeMapper } from './mappers/income-type.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';

@Controller('incomeTypes')
export class IncomeTypesController {
    constructor(private readonly incomeTypesService: IncomeTypesService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindIncomeTypeByCriteriaDto) {
        const incomeTypes = await this.incomeTypesService.findByCriteria(query);
        return IncomeTypeMapper.toResponseList(incomeTypes);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const role = await this.incomeTypesService.findById(id);
        if (!role) throw new ResourceNotFoundException('role', id);
        return IncomeTypeMapper.toResponse(role);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createIncomeTypeDto: CreateIncomeTypeDto) {
        const role = await this.incomeTypesService.create(createIncomeTypeDto);
        return IncomeTypeMapper.toResponse(role);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() updateIncomeTypeDto: UpdateIncomeTypeDto) {
        const role = await this.incomeTypesService.update(id, updateIncomeTypeDto);
        return IncomeTypeMapper.toResponse(role);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.incomeTypesService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.incomeTypesService.restore(id);
    }
}
