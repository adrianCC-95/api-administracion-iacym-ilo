import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Tables } from '../../../config/constants/tables';
import { AbstractEntity } from '../../../utils/abstract-entity';
import { LocationEntity } from 'src/modules/locations/entities/location.entity';
import { MinistryEntity } from 'src/modules/ministries/entities/ministry.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { ExpenseDetailEntity } from './expense-detail.entity';

@Entity({ name: 'expenses' })
export class ExpenseEntity extends AbstractEntity<ExpenseEntity> {
    @Column({ name: 'title', type: 'varchar', length: 200 })
    title: string;

    @Column({
        name: 'total_amount',
        type: 'decimal',
        precision: 12,
        scale: 2,
        default: 0.0,
    })
    totalAmount: number;

    @Column({ name: 'expense_date' })
    expenseDate: Date;

    @Column({ name: 'observation', type: 'text', nullable: true })
    observation: string | null;

    @ManyToOne(() => LocationEntity)
    @JoinColumn({ name: 'location_id' })
    location: LocationEntity;

    @ManyToOne(() => MinistryEntity, { nullable: true })
    @JoinColumn({ name: 'ministry_id' })
    ministry: MinistryEntity | null;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'registered_by' })
    registeredBy: UserEntity;

    @OneToMany(() => ExpenseDetailEntity, (detail) => detail.expense, {
        cascade: true,
    })
    details: ExpenseDetailEntity[];

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;
}
