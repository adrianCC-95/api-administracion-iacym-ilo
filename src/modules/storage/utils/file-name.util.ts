import { randomUUID } from 'crypto';

import * as path from 'path';

export function generateFileName(original: string) {
    const extension = path.extname(original);

    return randomUUID() + extension;
}
