import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { PricesService } from './prices.service'
import { PricesController } from './prices.controller'

@Module({
  controllers: [PricesController],
  imports: [HttpModule],
  providers: [PricesService],
})
export class PricesModule {}
