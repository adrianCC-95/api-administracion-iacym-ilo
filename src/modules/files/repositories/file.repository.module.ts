import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileEntity } from '../entities/file.entity';
import { FileRepositoryImpl } from './file.repository.impl';
import { FileRepository } from './file.repository';

@Module({
    imports: [TypeOrmModule.forFeature([FileEntity])],
    providers: [
        {
            provide: FileRepositoryImpl,
            useClass: FileRepository,
        },
    ],
    exports: [FileRepositoryImpl],
})
export class FilesRepositoryModule {}
