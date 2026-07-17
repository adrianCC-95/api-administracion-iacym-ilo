import { PaginatedResult } from '../../../types/pagination';
import { CreateMemberDto } from '../dto/create-member.dto';
import { FindMemberByCriteriaDto } from '../dto/find-member-by-criteria';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { MemberEntity } from '../entities/member.entity';
import { Member } from '../models/member.model';

export abstract class MemberRepositoryImpl {
    abstract create(createMemberDto: CreateMemberDto): Promise<MemberEntity>;
    abstract findById(id: Member['id']): Promise<MemberEntity | null>;
    abstract findByName(name: string): Promise<MemberEntity | null>;
    abstract findByCriteria(criteria: FindMemberByCriteriaDto): Promise<PaginatedResult<MemberEntity>>;
    abstract update(id: Member['id'], updateMemberDto: UpdateMemberDto): Promise<MemberEntity>;
    abstract softDelete(id: Member['id']): Promise<void>;
    abstract findByIdWithDeleted(id: Member['id']): Promise<MemberEntity | null>;
    abstract restore(id: Member['id']): Promise<void>;
}
