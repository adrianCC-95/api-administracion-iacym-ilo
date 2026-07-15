import { PaginatedResult } from '../../../types/pagination';
import { CreateMinistryDto } from '../dto/create-ministry.dto';
import { FindMinistryByCriteriaDto } from '../dto/find-ministry-by-criteria';
import { UpdateMinistryDto } from '../dto/update-ministry.dto';
import { MinistryEntity } from '../entities/ministry.entity';
import { Ministry } from '../models/ministry.model';

export abstract class MinistryRepositoryImpl {
    abstract create(createMinistryDto: CreateMinistryDto): Promise<MinistryEntity>;
    abstract findById(id: Ministry['id']): Promise<MinistryEntity | null>;
    abstract findByName(name: string): Promise<MinistryEntity | null>;
    abstract findByCriteria(criteria: FindMinistryByCriteriaDto): Promise<PaginatedResult<MinistryEntity>>;
    abstract update(id: Ministry['id'], updateMinistryDto: UpdateMinistryDto): Promise<MinistryEntity>;
    abstract softDelete(id: Ministry['id']): Promise<void>;
    abstract restore(id: Ministry['id']): Promise<void>;
}
