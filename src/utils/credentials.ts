import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';

export const encryptPassword = async (plainTextPassword: string): Promise<string> => {
    try {
        const SALT_OR_ROUNDS = 10;
        return await bcrypt.hash(plainTextPassword, SALT_OR_ROUNDS);
    } catch (error) {
        console.error('Error encrypting password:', error);
        throw new InternalServerErrorException('Failed to encrypt password');
    }
};

export const verifyPassword = async (plainTextPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(plainTextPassword, hashedPassword);
    } catch (error) {
        console.error('Error verifying password', error);
        throw new InternalServerErrorException('Failed to verify password');
    }
};
