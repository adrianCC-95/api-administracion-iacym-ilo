import { CreateLocationDto } from '../dto/create-location.dto';
import { LocationEntity } from '../entities/location.entity';
import { UpdateLocationDto } from '../dto/update-location.dto';
import { FindLocationByyCriteriaDto } from '../dto/find-location-by-criteria.dto';
import { Location } from '../models/location.model';
import { PaginatedResult } from '../../../types/pagination';

export abstract class LocationRepositoryImpl {
    abstract create(createLocationDto: CreateLocationDto): Promise<LocationEntity>;
    abstract findById(id: Location['id']): Promise<LocationEntity | null>;
    abstract findByName(name: string): Promise<LocationEntity | null>;
    abstract findByCriteria(criteria: FindLocationByyCriteriaDto): Promise<PaginatedResult<LocationEntity>>;
    abstract update(id: Location['id'], updateLocationDto: UpdateLocationDto): Promise<LocationEntity>;
    abstract softDelete(id: Location['id']): Promise<void>;
    abstract restore(id: Location['id']): Promise<void>;
}
