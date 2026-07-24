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
} from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MembersService } from './members.service';
import { FindMemberByCriteriaDto } from './dto/find-member-by-criteria';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { MemberMapper } from './mappers/member.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';
import { ExportMemberCriteriaDto } from './dto/export-member-criteria.dto';
import { Response } from 'express';

@Controller('members')
export class MembersController {
    constructor(private readonly membersService: MembersService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindMemberByCriteriaDto) {
        const ministries = await this.membersService.findByCriteria(query);
        return MemberMapper.toResponseList(ministries);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get('export')
    async export(@Query() query: ExportMemberCriteriaDto, @Res() res: Response) {
        await this.membersService.export(query, res);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const member = await this.membersService.findById(id);
        if (!member) throw new ResourceNotFoundException('member', id);
        return MemberMapper.toResponse(member);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createMemberDto: CreateMemberDto) {
        const member = await this.membersService.create(createMemberDto);
        return MemberMapper.toResponse(member);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() updateMemberDto: UpdateMemberDto) {
        const member = await this.membersService.update(id, updateMemberDto);
        return MemberMapper.toResponse(member);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.membersService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.membersService.restore(id);
    }
}
