import { Location, LocationResponse } from '../../locations/models/location.model';
import { Role, RoleResponse } from '../../roles/models/role.model';

export class User {
    id: number;
    name: string;
    username: string;
    password: string;
    role: Role;
    location: Location | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
}

export class UserResponse {
    id: number;
    name: string;
    username: string;
    role: Partial<RoleResponse>;
    location: Partial<LocationResponse>;
    createdAt: Date;
    isDeleted: boolean;
}

export type AuthSession = {
    id: number;
    name: string;
    locationId: number | null;
    roleId: number;
    roleName: string;
};
