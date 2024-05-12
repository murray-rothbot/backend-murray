import { Controller, Get, Injectable, Query } from '@nestjs/common'
import { PricesService } from './prices.service'
import { ConvertRequestDto } from './dto'
import { MessageResponseDto } from '../../shared/dtos'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Injectable()
@Controller('prices')
@ApiTags('Prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @ApiOperation({
    summary: 'Get capitalization information.',
  })
  @Get('/')
  async getPrices(): Promise<MessageResponseDto> {
    return await this.pricesService.getTickers()
  }

  @ApiOperation({
    summary: 'Get raw prices information.',
  })
  @Get('/raw')
  async getRawPrices(): Promise<MessageResponseDto> {
    return await this.pricesService.getRawTickers()
  }

  @ApiOperation({
    summary: 'Get convert prices information.',
  })
  @Get('/convert')
  async convert(@Query() convertDto: ConvertRequestDto): Promise<MessageResponseDto> {
    return await this.pricesService.convert({
      currency: convertDto.currency,
      value: convertDto.value,
    })
  }
}
