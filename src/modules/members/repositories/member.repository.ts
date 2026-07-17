import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PaginatedResult } from '../../../types/pagination';
import { Query } from '../../../utils/query';
import { CriticalInternalError } from '../../../common/exceptions/critical-internal-error-exception';
import { MemberRepositoryImpl } from './member.repository.impl';
import { MemberEntity } from '../entities/member.entity';
import { Member } from '../models/member.model';
import { FindMemberByCriteriaDto } from '../dto/find-member-by-criteria';
import { CreateMemberDto } from '../dto/create-member.dto';
import { UpdateMemberDto } from '../dto/update-member.dto';
import { MinistryEntity } from 'src/modules/ministries/entities/ministry.entity';
import { PositionEntity } from 'src/modules/positions/entities/position.entity';
import { ResourceNotFoundException } from 'src/common/exceptions/not-found-exception';

@Injectable()
export class MemberRepository implements MemberRepositoryImpl {
    constructor(
        @InjectRepository(MemberEntity)
        private readonly memberRepository: Repository<MemberEntity>,

        @InjectRepository(MinistryEntity)
        private readonly ministryRepository: Repository<MinistryEntity>,

        @InjectRepository(PositionEntity)
        private readonly positionRepository: Repository<PositionEntity>,
    ) {}

    async findById(id: Member['id']): Promise<MemberEntity | null> {
        try {
            return await this.memberRepository
                .createQueryBuilder('member')
                .leftJoinAndSelect('member.location', 'location')
                .leftJoinAndSelect('member.ministries', 'ministries')
                .leftJoinAndSelect('member.position', 'position')
                .where('member.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByName(name: string): Promise<MemberEntity | null> {
        try {
            return await this.memberRepository
                .createQueryBuilder('member')
                .where('member.name = :name', { name })
                .withDeleted()
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByCriteria(criteria: FindMemberByCriteriaDto): Promise<PaginatedResult<MemberEntity>> {
        try {
            const qb = this.memberRepository
                .createQueryBuilder('member')
                .leftJoinAndSelect('member.location', 'location')
                .leftJoinAndSelect('member.ministries', 'ministries')
                .leftJoinAndSelect('member.position', 'position');

            if (criteria.name) {
                qb.andWhere('member.name LIKE :name', { name: `%${criteria.name}%` });
            }

            if (criteria.status) {
                Query.applyStatusFilter(qb, 'member', criteria.status);
            }
            Query.sortCriteria(qb, `member.${criteria.sortField}`, criteria.sortDirection);

            return Query.fetchPaged(qb, criteria.page, criteria.size);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async create(createMemberDto: CreateMemberDto): Promise<MemberEntity> {
        try {
            const ministries =
                createMemberDto.ministryIds && createMemberDto.ministryIds.length > 0
                    ? await this.ministryRepository.find({
                          where: {
                              id: In(createMemberDto.ministryIds),
                          },
                      })
                    : [];

            const position = await this.positionRepository.findOneBy({
                id: createMemberDto.positionId,
            });

            if (!position) {
                throw new ResourceNotFoundException('Position', createMemberDto.positionId);
            }

            const entity = this.memberRepository.create({
                name: createMemberDto.name,
                lastName: createMemberDto.lastName,
                birthDate: createMemberDto.birthDate,
                email: createMemberDto.email,
                phone: createMemberDto.phone,
                address: createMemberDto.address,
                location: {
                    id: createMemberDto.locationId,
                } as any,
                ministries,
                position,
            });

            const saved = await this.memberRepository.save(entity);

            return (await this.findById(saved.id)) as MemberEntity;
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async update(id: Member['id'], updateMemberDto: UpdateMemberDto): Promise<MemberEntity> {
        try {
            const member = await this.findById(id);

            if (!member) {
                throw new Error('Member not found');
            }

            if (updateMemberDto.name !== undefined) member.name = updateMemberDto.name;

            if (updateMemberDto.lastName !== undefined) member.lastName = updateMemberDto.lastName;

            if (updateMemberDto.birthDate !== undefined) member.birthDate = updateMemberDto.birthDate;

            if (updateMemberDto.email !== undefined) member.email = updateMemberDto.email;

            if (updateMemberDto.phone !== undefined) member.phone = updateMemberDto.phone;

            if (updateMemberDto.address !== undefined) member.address = updateMemberDto.address;

            if (updateMemberDto.locationId !== undefined) {
                member.location = {
                    id: updateMemberDto.locationId,
                } as any;
            }

            if (updateMemberDto.ministryIds !== undefined) {
                member.ministries = await this.ministryRepository.find({
                    where: {
                        id: In(updateMemberDto.ministryIds),
                    },
                });
            }

            if (updateMemberDto.positionId !== undefined) {
                member.position = (await this.positionRepository.findOneBy({
                    id: updateMemberDto.positionId,
                }))!;
            }

            await this.memberRepository.save(member);

            return (await this.findById(id)) as MemberEntity;
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async softDelete(id: Member['id']): Promise<void> {
        try {
            await this.memberRepository.softDelete(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
    async restore(id: Member['id']): Promise<void> {
        try {
            await this.memberRepository.restore(id);
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }

    async findByIdWithDeleted(id: Member['id']): Promise<MemberEntity | null> {
        try {
            return await this.memberRepository
                .createQueryBuilder('member')
                .withDeleted()
                .leftJoinAndSelect('member.location', 'location')
                .leftJoinAndSelect('member.position', 'position')
                .where('member.id = :id', { id })
                .getOne();
        } catch (error) {
            throw new CriticalInternalError(error as string);
        }
    }
}
