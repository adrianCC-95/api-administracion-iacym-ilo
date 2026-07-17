import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodsService } from './payment-methods.service';
import { FindPaymentMethodByCriteriaDto } from './dto/find-payment-method-by-criteria';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { PaymentMethodMapper } from './mappers/payment-method.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';

@Controller('payment-methods')
export class PaymentMethodsController {
    constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindPaymentMethodByCriteriaDto) {
        const paymentMethods = await this.paymentMethodsService.findByCriteria(query);
        return PaymentMethodMapper.toResponseList(paymentMethods);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const paymentMethod = await this.paymentMethodsService.findById(id);
        if (!paymentMethod) throw new ResourceNotFoundException('paymentMethod', id);
        return PaymentMethodMapper.toResponse(paymentMethod);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
        const paymentMethod = await this.paymentMethodsService.create(createPaymentMethodDto);
        return PaymentMethodMapper.toResponse(paymentMethod);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
        const paymentMethod = await this.paymentMethodsService.update(id, updatePaymentMethodDto);
        return PaymentMethodMapper.toResponse(paymentMethod);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.paymentMethodsService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.paymentMethodsService.restore(id);
    }
}
