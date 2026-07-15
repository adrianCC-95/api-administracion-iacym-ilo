import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { Tables } from '../../../config/constants/tables';
import { AbstractEntity } from '../../../utils/abstract-entity';
import { MemberEntity } from '../../members/entities/member.entity';

@Entity({ name: Tables.ministry })
export class MinistryEntity extends AbstractEntity<MinistryEntity> {
    @Column({ name: 'name' })
    name: string;

    @Column({
        name: 'description',
        type: 'text',
        nullable: true,
    })
    description: string | null;

    @ManyToMany(() => MemberEntity, (member) => member.ministries)
    members: MemberEntity[];

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date | null;
}
