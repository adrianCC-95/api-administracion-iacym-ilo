import { AuthSession } from '../modules/users/models/user.model';

declare module 'express' {
    interface Request {
        user?: AuthSession | null;
    }
}
