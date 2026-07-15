import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberEntity } from '../entities/member.entity';
import { MemberRepositoryImpl } from './member.repository.impl';
import { MemberRepository } from './member.repository';
import { MinistryEntity } from 'src/modules/ministries/entities/ministry.entity';
import { PositionEntity } from 'src/modules/positions/entities/position.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MemberEntity, MinistryEntity, PositionEntity])],
    providers: [
        {
            provide: MemberRepositoryImpl,
            useClass: MemberRepository,
        },
    ],
    exports: [MemberRepositoryImpl],
})
export class MembersRepositoryModule {}
