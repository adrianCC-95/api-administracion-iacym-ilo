import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Tables } from '../../../config/constants/tables';
import { ActionTypes } from '../models/acitivity-log';

@Entity({ name: Tables.activityLog })
export class ActivityLogEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'author_id', type: 'int' })
    authorId: number;

    @Column({ name: 'author_name', type: 'varchar' })
    authorName: string;

    @Column({ name: 'author_role', type: 'varchar' })
    authorRole: string;

    @Column({ name: 'target_id', type: 'int' })
    targetId: number;

    @Column({ name: 'target_table', type: 'varchar', length: 50 })
    targetTable: string;

    @Column({
        name: 'action_type',
        type: 'enum',
        enum: ActionTypes,
    })
    actionType: ActionTypes;

    @Column({ name: 'before_data', type: 'json', nullable: true })
    beforeData: Record<string, any> | null;

    @Column({ name: 'after_data', type: 'json', nullable: true })
    afterData: Record<string, any> | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
