import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { Tables } from '../../../config/constants/tables';
import { AbstractEntity } from '../../../utils/abstract-entity';

@Entity({ name: Tables.expenseType })
export class ExpenseTypeEntity extends AbstractEntity<ExpenseTypeEntity> {
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string | null;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;
}
