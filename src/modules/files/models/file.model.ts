export class File {
    id: number;

    originalName: string;

    fileName: string;

    extension: string;

    mimeType: string;

    path: string;

    storage: string;

    hash: string | null;

    size: number;

    createdAt: Date;

    updatedAt: Date | null;

    deletedAt: Date | null;
}

export class FileResponse {
    id: number;

    originalName: string;

    path: string;

    size: number;

    url: string;

    mimeType: string;

    createdAt: Date;

    isDeleted: boolean;
}
