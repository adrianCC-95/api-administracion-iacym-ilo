export class ActivityLog {
    id: number;
    actionType: string;
    authorId: number;
    authorName: string;
    authorRole: string;
    targetId: number;
    targetTable: string;
    beforeData: Record<string, any> | null;
    afterData: Record<string, any> | null;
    createdAt: Date;
}

export class ActivityLogResponse {
    id: number;
    actionType: string;
    authorId: number;
    authorName: string;
    authorRole: string;
    targetId: number;
    targetTable: string;
    beforeData: Record<string, any> | null;
    afterData: Record<string, any> | null;
    createdAt: Date;
}

export enum ActionTypes {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    RESTORE = 'RESTORE',
}
