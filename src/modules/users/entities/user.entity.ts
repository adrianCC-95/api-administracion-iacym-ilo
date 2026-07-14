import { Column, DeleteDateColumn, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Tables } from '../../../config/constants/tables';
import { AbstractEntity } from '../../../utils/abstract-entity';
import { RoleEntity } from '../../roles/entities/role.entity';
import { LocationEntity } from '../../locations/entities/location.entity';

@Entity({ name: Tables.users })
export class UserEntity extends AbstractEntity<UserEntity> {
    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'username' })
    username: string;

    @Column({ name: 'password' })
    password: string;

    @OneToOne(() => LocationEntity)
    @JoinColumn({ name: 'location_id' })
    location: LocationEntity | null;

    @OneToOne(() => RoleEntity)
    @JoinColumn({ name: 'role_id' })
    role: RoleEntity;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;
}
