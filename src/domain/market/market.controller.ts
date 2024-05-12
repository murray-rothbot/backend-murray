import { Controller, Get, Injectable } from '@nestjs/common'
import { MarketService } from './market.service'
import { MessageResponseDto } from '../../shared/dtos'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Injectable()
@Controller('market')
@ApiTags('Prices')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @ApiOperation({
    summary: 'Get capitalization information.',
  })
  @Get('/capitalization')
  async getMarketCap(): Promise<MessageResponseDto> {
    return await this.marketService.getMarketCap()
  }
}
