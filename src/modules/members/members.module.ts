import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MembersRepositoryModule } from './repositories/member.repository.module';
import { MemberExcelService } from './services/member-excel.service';

@Module({
    imports: [MembersRepositoryModule],
    controllers: [MembersController],
    providers: [MembersService, MemberExcelService],
    exports: [MembersService],
})
export class MembersModule {}
