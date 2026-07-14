import { Column, DeleteDateColumn, Entity } from 'typeorm';
import { Tables } from '../../../config/constants/tables';
import { AbstractEntity } from '../../../utils/abstract-entity';

@Entity({ name: Tables.locations })
export class LocationEntity extends AbstractEntity<LocationEntity> {
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: true })
    description: string | null;

    @Column({ name: 'address', type: 'varchar', nullable: true })
    address: string | null;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;
}
