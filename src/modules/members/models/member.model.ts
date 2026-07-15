import { Location } from 'src/modules/locations/models/location.model';
import { Ministry } from 'src/modules/ministries/models/ministry.model';
import { Position } from '../../positions/models/position.model';

export class Member {
    id: number;
    name: string;
    lastName: string;
    birthDate: Date;
    email: string;
    phone: string;
    address: string;
    location: Location;
    position: Position;
    ministries: Ministry[];
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class MemberResponse {
    id: number;
    name: string;
    lastName: string;
    birthDate: Date;
    email: string;
    phone: string;
    address: string;
    location: Location;
    position: Position;
    ministries: Ministry[];
    createdAt: Date;
    isDeleted: boolean;
}
