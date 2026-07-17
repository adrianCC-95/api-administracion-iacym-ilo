import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FilesService } from './files.service';
import { FindFileByCriteriaDto } from './dto/find-file-by-criteria';
import { IsIdPipe } from '../../common/pipes/is-id.pipe';
import { FileMapper } from './mappers/file.mapper';
import { ResourceNotFoundException } from '../../common/exceptions/not-found-exception';
import { RequireAuth } from '../../common/decorators/require-auth';

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get()
    async findByCriteria(@Query() query: FindFileByCriteriaDto) {
        const files = await this.filesService.findByCriteria(query);
        return FileMapper.toResponseList(files);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async findById(@Param('id', IsIdPipe) id: number) {
        const file = await this.filesService.findById(id);
        if (!file) throw new ResourceNotFoundException('file', id);
        return FileMapper.toResponse(file);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createFileDto: CreateFileDto) {
        const file = await this.filesService.create(createFileDto);
        return FileMapper.toResponse(file);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Put(':id')
    async update(@Param('id', IsIdPipe) id: number, @Body() updateFileDto: UpdateFileDto) {
        const file = await this.filesService.update(id, updateFileDto);
        return FileMapper.toResponse(file);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async remove(@Param('id', IsIdPipe) id: number) {
        return await this.filesService.softDelete(id);
    }

    @RequireAuth()
    @HttpCode(HttpStatus.OK)
    @Patch(':id/restore')
    async restore(@Param('id', IsIdPipe) id: number) {
        return await this.filesService.restore(id);
    }
}
