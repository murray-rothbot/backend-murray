import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { LightningService } from './lightning.service'
import { MarketController } from './lightning.controller'

@Module({
  controllers: [MarketController],
  imports: [HttpModule],
  providers: [LightningService],
})
export class LightningModule {}
