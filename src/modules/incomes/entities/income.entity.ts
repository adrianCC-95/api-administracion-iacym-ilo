import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Tables } from '../../../config/constants/tables';
import { AbstractEntity } from '../../../utils/abstract-entity';
import { MemberEntity } from 'src/modules/members/entities/member.entity';
import { IncomeTypeEntity } from 'src/modules/income-types/entities/income-type.entity';
import { PaymentMethodEntity } from 'src/modules/payment-methods/entities/payment-method.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { FileEntity } from 'src/modules/files/entities/file.entity';

@Entity({ name: Tables.incomes })
export class IncomeEntity extends AbstractEntity<IncomeEntity> {
    @Column({
        name: 'amount',
        type: 'decimal',
        precision: 12,
        scale: 2,
    })
    amount: number;

    @Column({ name: 'income_date' })
    incomeDate: Date;

    @ManyToOne(() => FileEntity, {
        nullable: true,
    })
    @JoinColumn({
        name: 'voucher_file_id',
    })
    voucherFile: FileEntity | null;

    @Column({
        type: 'varchar',
        name: 'reference_number',
        nullable: true,
    })
    referenceNumber?: string | null;

    @Column({
        name: 'observation',
        type: 'text',
        nullable: true,
    })
    observation: string | null;

    @ManyToOne(() => MemberEntity)
    @JoinColumn({ name: 'member_id' })
    member: MemberEntity;

    @ManyToOne(() => IncomeTypeEntity)
    @JoinColumn({ name: 'income_type_id' })
    incomeType: IncomeTypeEntity;

    @ManyToOne(() => PaymentMethodEntity)
    @JoinColumn({ name: 'payment_method_id' })
    paymentMethod: PaymentMethodEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'registered_by' })
    registeredBy: UserEntity;

    @DeleteDateColumn({
        name: 'deleted_at',
    })
    deletedAt: Date | null;
}
