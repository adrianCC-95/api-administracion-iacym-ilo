import { Tables } from 'src/config/constants/tables';
import { MemberEntity } from 'src/modules/members/entities/member.entity';
import { AbstractEntity } from 'src/utils/abstract-entity';
import { Column, DeleteDateColumn, Entity, OneToMany } from 'typeorm';

@Entity({ name: Tables.position })
export class PositionEntity extends AbstractEntity<PositionEntity> {
    @Column({
        name: 'name',
    })
    name: string;

    @Column({
        name: 'description',
        type: 'text',
        nullable: true,
    })
    description: string | null;

    @OneToMany(() => MemberEntity, (member) => member.position)
    members: MemberEntity[];

    @DeleteDateColumn({
        name: 'deleted_at',
    })
    deletedAt: Date | null;
}
