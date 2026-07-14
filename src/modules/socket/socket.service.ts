import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketService {
    findAll() {
        return `This action returns all socket`;
    }
}
