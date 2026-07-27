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
    Res,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { FindExpenseByCriteriaDto } from './dto/find-expense-by-criteria.dto';
import { ExportExpenseCriteriaDto } from './dto/export-expense-criteria.dto';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { ExpenseMapper } from './mappers/expense.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@Controller('expenses')
export class ExpensesController {
    constructor(private readonly expensesService: ExpensesService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindExpenseByCriteriaDto) {
        const expenses = await this.expensesService.findByCriteria(query);
        return ExpenseMapper.toResponseList(expenses);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('export')
    async export(@Query() query: ExportExpenseCriteriaDto, @Res() res: Response) {
        await this.expensesService.export(query, res);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const expense = await this.expensesService.findById(id);
        if (!expense) throw new ResourceNotFoundException('expense', id);
        return ExpenseMapper.toResponse(expense);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    @UseInterceptors(FilesInterceptor('vouchers'))
    async create(
        @CurrentUser() user: any,
        @UploadedFiles() vouchers: Express.Multer.File[] | undefined,
        @Body() createExpenseDto: CreateExpenseDto,
    ) {
        const expense = await this.expensesService.create(createExpenseDto, vouchers, user.id);
        return ExpenseMapper.toResponse(expense);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    @UseInterceptors(FilesInterceptor('vouchers'))
    async update(
        @UploadedFiles() vouchers: Express.Multer.File[] | undefined,
        @Param('id', IsIdPipe) id: number,
        @Body() updateExpenseDto: UpdateExpenseDto,
    ) {
        const expense = await this.expensesService.update(id, vouchers, updateExpenseDto);
        return ExpenseMapper.toResponse(expense);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.expensesService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.expensesService.restore(id);
    }
}
