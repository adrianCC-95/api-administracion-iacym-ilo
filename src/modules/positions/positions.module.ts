import { Module } from '@nestjs/common';

import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PositionsRepositoryModule } from './repositories/position.repository.module';

@Module({
    imports: [PositionsRepositoryModule],
    controllers: [PositionsController],
    providers: [PositionsService],
    exports: [PositionsService],
})
export class PositionsModule {}
