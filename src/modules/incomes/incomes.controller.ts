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
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { IncomesService } from './incomes.service';
import { FindIncomeByCriteriaDto } from './dto/find-income-by-criteria';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { IncomeMapper } from './mappers/income.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('incomes')
export class IncomesController {
    constructor(private readonly incomesService: IncomesService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindIncomeByCriteriaDto) {
        const incomes = await this.incomesService.findByCriteria(query);
        return IncomeMapper.toResponseList(incomes);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const income = await this.incomesService.findById(id);
        if (!income) throw new ResourceNotFoundException('income', id);
        return IncomeMapper.toResponse(income);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    @UseInterceptors(FileInterceptor('voucher'))
    async create(
        @CurrentUser() user: any,
        @UploadedFile() voucher: Express.Multer.File | undefined,
        @Body() createIncomeDto: CreateIncomeDto,
    ) {
        const income = await this.incomesService.create(createIncomeDto, voucher, user.id);

        return IncomeMapper.toResponse(income);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    @UseInterceptors(FileInterceptor('voucher'))
    async update(
        @UploadedFile() voucher: Express.Multer.File | undefined,
        @Param('id', IsIdPipe) id: number,
        @Body() updateIncomeDto: UpdateIncomeDto,
    ) {
        const income = await this.incomesService.update(id, voucher, updateIncomeDto);
        return IncomeMapper.toResponse(income);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.incomesService.softDelete(id);
    }

    // @RequireAuth()
    // @HttpCode(HttpStatus.OK)
    // @Delete(':id')
    // async delete(@Param('id', IsIdPipe) id: number) {
    //     return this.incomesService.delete(id);
    // }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.incomesService.restore(id);
    }
}
