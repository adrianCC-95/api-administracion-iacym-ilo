import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MembersRepositoryModule } from './repositories/member.repository.module';

@Module({
    imports: [MembersRepositoryModule],
    controllers: [MembersController],
    providers: [MembersService],
    exports: [MembersService],
})
export class MembersModule {}
