import { createHash } from 'crypto';

export function createSHA256(buffer: Buffer) {
    return createHash('sha256')
        .update(buffer)

        .digest('hex');
}
