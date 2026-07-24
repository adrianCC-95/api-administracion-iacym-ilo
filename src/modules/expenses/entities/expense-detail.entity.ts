import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ExpenseEntity } from './expense.entity';
import { ExpenseTypeEntity } from 'src/modules/expense-types/entities/expense-type.entity';
import { PaymentMethodEntity } from 'src/modules/payment-methods/entities/payment-method.entity';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { VoucherType } from '../dto/create-expense-detail.dto';

@Entity({ name: 'expense_details' })
export class ExpenseDetailEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ExpenseEntity, (expense) => expense.details, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'expense_id' })
    expense: ExpenseEntity;

    @ManyToOne(() => ExpenseTypeEntity)
    @JoinColumn({ name: 'expense_type_id' })
    expenseType: ExpenseTypeEntity;

    @ManyToOne(() => PaymentMethodEntity)
    @JoinColumn({ name: 'payment_method_id' })
    paymentMethod: PaymentMethodEntity;

    @ManyToOne(() => FileEntity, { nullable: true })
    @JoinColumn({ name: 'voucher_file_id' })
    voucherFile: FileEntity | null;

    @Column({ name: 'supplier_or_beneficiary', type: 'varchar', length: 150 })
    supplierOrBeneficiary: string;

    @Column({
        name: 'voucher_type',
        type: 'enum',
        enum: VoucherType,
        default: VoucherType.OTRO,
    })
    voucherType: VoucherType;

    @Column({ name: 'voucher_number', type: 'varchar', length: 100, nullable: true })
    voucherNumber: string | null;

    @Column({ name: 'amount', type: 'decimal', precision: 12, scale: 2 })
    amount: number;

    @Column({ name: 'concept_detail', type: 'varchar', length: 255 })
    conceptDetail: string;
}
