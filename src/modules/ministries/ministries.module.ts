import { Module } from '@nestjs/common';
import { MinistriesService } from './ministries.service';
import { MinistriesController } from './ministries.controller';
import { MinistriesRepositoryModule } from './repositories/ministry.repository.module';

@Module({
    imports: [MinistriesRepositoryModule],
    controllers: [MinistriesController],
    providers: [MinistriesService],
    exports: [MinistriesService],
})
export class MinistriesModule {}
