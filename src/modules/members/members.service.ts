import { Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MemberRepositoryImpl } from './repositories/member.repository.impl';
import { FindMemberByCriteriaDto } from './dto/find-member-by-criteria';
import { DuplicateException } from '../../common/exceptions/duplicate-exception';
import { MemberMapper } from './mappers/member.mapper';
import { Member } from './models/member.model';
import { Response } from 'express';
import { ExportMemberCriteriaDto } from './dto/export-member-criteria.dto';
import { MemberExcelService } from './services/member-excel.service';

@Injectable()
export class MembersService {
    constructor(
        private readonly memberRepository: MemberRepositoryImpl,
        private readonly memberExcelService: MemberExcelService,
    ) {}

    async findById(id: Member['id']) {
        const entity = await this.memberRepository.findById(id);
        return entity ? MemberMapper.toDomain(entity) : null;
    }

    async findByCriteria(criteria: FindMemberByCriteriaDto) {
        const entities = await this.memberRepository.findByCriteria(criteria);
        return MemberMapper.toDomainList(entities);
    }

    async create(createMemberDto: CreateMemberDto) {
        const existingMember = await this.memberRepository.findByName(createMemberDto.name);

        if (existingMember) throw new DuplicateException('Member', createMemberDto.name);

        const newMember = await this.memberRepository.create(createMemberDto);
        return MemberMapper.toDomain(newMember);
    }

    async update(id: Member['id'], updateMemberDto: UpdateMemberDto) {
        const updatedMember = await this.memberRepository.update(id, updateMemberDto);
        return MemberMapper.toDomain(updatedMember);
    }

    async softDelete(id: Member['id']) {
        const Member = await this.findById(id);

        if (!Member) throw new DuplicateException('Member', id);

        return await this.memberRepository.softDelete(id);
    }

    async restore(id: Member['id']) {
        return await this.memberRepository.restore(id);
    }
    async findByIdWithDeleted(id: Member['id']) {
        const entity = await this.memberRepository.findByIdWithDeleted(id);

        return entity ? MemberMapper.toDomain(entity) : null;
    }

    async count(): Promise<number> {
        return this.memberRepository.count();
    }

    async export(criteria: ExportMemberCriteriaDto, res: Response): Promise<void> {
        const entities = await this.memberRepository.exportByCriteria(criteria);
        const incomes = entities.map((entity) => MemberMapper.toDomain(entity));

        await this.memberExcelService.generateExcelResponse(incomes, criteria, res);
    }
}
