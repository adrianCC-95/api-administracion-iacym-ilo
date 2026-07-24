import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateExpenseTypeDto } from './dto/create-expense-type.dto';
import { UpdateExpenseTypeDto } from './dto/update-expense-type.dto';
import { ExpenseTypesService } from './expense-types.service';
import { FindExpenseTypeByCriteriaDto } from './dto/find-expense-type-by-criteria';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { ExpenseTypeMapper } from './mappers/expense-type.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';

@Controller('expense-types')
export class ExpenseTypesController {
    constructor(private readonly expenseTypesService: ExpenseTypesService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindExpenseTypeByCriteriaDto) {
        const expenseTypes = await this.expenseTypesService.findByCriteria(query);
        return ExpenseTypeMapper.toResponseList(expenseTypes);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const role = await this.expenseTypesService.findById(id);
        if (!role) throw new ResourceNotFoundException('role', id);
        return ExpenseTypeMapper.toResponse(role);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createExpenseTypeDto: CreateExpenseTypeDto) {
        const role = await this.expenseTypesService.create(createExpenseTypeDto);
        return ExpenseTypeMapper.toResponse(role);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() updateExpenseTypeDto: UpdateExpenseTypeDto) {
        const role = await this.expenseTypesService.update(id, updateExpenseTypeDto);
        return ExpenseTypeMapper.toResponse(role);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.expenseTypesService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.expenseTypesService.restore(id);
    }
}
