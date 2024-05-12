import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { BlockchainService } from './blockchain.service'
import { BlockchainController } from './blockchain.controller'

@Module({
  controllers: [BlockchainController],
  imports: [HttpModule],
  providers: [BlockchainService],
})
export class BlockchainModule {}
