import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { Tables } from '../../../config/constants/tables';
import { AbstractEntity } from '../../../utils/abstract-entity';

@Entity({ name: Tables.files })
export class FileEntity extends AbstractEntity<FileEntity> {
    @Column({ name: 'original_name' })
    originalName: string;

    @Column({ name: 'file_name' })
    fileName: string;

    @Column({ name: 'extension' })
    extension: string;

    @Column({ name: 'mime_type' })
    mimeType: string;

    @Column({ name: 'path' })
    path: string;

    @Column({ name: 'storage' })
    storage: string;

    @Column({
        type: 'varchar',
        length: 64,
        nullable: true,
    })
    hash?: string;

    @Column({
        type: 'bigint',
        name: 'size',
    })
    size: number;

    @DeleteDateColumn({
        name: 'deleted_at',
    })
    deletedAt: Date | null;
}
