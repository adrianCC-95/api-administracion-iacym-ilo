import {
    Column,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
} from 'typeorm';
import { Tables } from '../../../config/constants/tables';
import { AbstractEntity } from '../../../utils/abstract-entity';
import { LocationEntity } from '../../locations/entities/location.entity';
import { MinistryEntity } from '../../ministries/entities/ministry.entity';
import { PositionEntity } from '../../positions/entities/position.entity';

@Entity({ name: Tables.members })
export class MemberEntity extends AbstractEntity<MemberEntity> {
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ name: 'birth_date' })
    birthDate: Date;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'phone' })
    phone: string;

    @Column({ name: 'address' })
    address: string;

    @ManyToMany(() => MinistryEntity, (ministry) => ministry.members)
    @JoinTable({
        name: 'member_ministry',
        joinColumn: {
            name: 'member_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'ministry_id',
            referencedColumnName: 'id',
        },
    })
    ministries: MinistryEntity[];

    @OneToOne(() => LocationEntity)
    @JoinColumn({ name: 'location_id' })
    location!: LocationEntity;

    @ManyToOne(() => PositionEntity, (position) => position.members)
    @JoinColumn({ name: 'position_id' })
    position!: PositionEntity;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;
}
