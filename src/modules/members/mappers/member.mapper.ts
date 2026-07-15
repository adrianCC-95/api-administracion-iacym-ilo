import { LocationMapper } from '../../locations/mappers/location.mapper';
import { mapPaginated } from '../../../utils/pagination';
import { PaginatedResult } from '../../../types/pagination';
import { Member, MemberResponse } from '../models/member.model';
import { MemberEntity } from '../entities/member.entity';
import { MinistryMapper } from 'src/modules/ministries/mappers/Ministry.mapper';
import { PositionMapper } from '../../positions/mappers/position.mapper';

export class MemberMapper {
    static toDomain(entity: MemberEntity): Member {
        const member = new Member();

        member.id = entity.id;
        member.name = entity.name;
        member.lastName = entity.lastName;
        member.birthDate = entity.birthDate;
        member.email = entity.email;
        member.phone = entity.phone;
        member.address = entity.address;
        member.ministries = entity.ministries ? entity.ministries.map(MinistryMapper.toDomain) : [];
        member.location = LocationMapper.toDomain(entity.location);
        member.position = PositionMapper.toDomain(entity.position);
        member.createdAt = entity.createdAt;
        member.updatedAt = entity.updatedAt;
        member.deletedAt = entity.deletedAt;

        return member;
    }

    static toDomainList(entities: PaginatedResult<MemberEntity>): PaginatedResult<Member> {
        return mapPaginated(entities, this.toDomain);
    }

    static toResponse(member: Member): MemberResponse {
        const response = new MemberResponse();

        response.id = member.id;
        response.name = member.name;
        response.lastName = member.lastName;
        response.birthDate = member.birthDate;
        response.email = member.email;
        response.phone = member.phone;
        response.address = member.address;
        response.location = member.location;
        response.position = member.position;
        response.ministries = member.ministries;

        response.createdAt = member.createdAt;
        response.isDeleted = member.deletedAt !== null;

        return response;
    }
    static toResponseList(list: PaginatedResult<Member>): PaginatedResult<MemberResponse> {
        return mapPaginated(list, this.toResponse);
    }
}
