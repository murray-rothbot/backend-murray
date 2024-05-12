import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import config from './config/env.config'

import { AppService } from './app.service'
import { AppController } from './app.controller'

import { BlockchainModule } from './domain/blockchain/blockchain.module'
import { PricesModule } from './domain/prices/prices.module'
import { MarketModule } from './domain/market/market.module'
import { LightningModule } from './domain/lightning/lightning.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ScheduleModule.forRoot(),
    BlockchainModule,
    LightningModule,
    MarketModule,
    PricesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
