import { Controller, Get, Injectable, Param } from '@nestjs/common'
import { LightningService } from './lightning.service'
import { MessageResponseDto } from '../../shared/dtos'
import { NodeRequestParamsDto } from './dto'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Injectable()
@Controller('lightning')
@ApiTags('Lightning')
export class MarketController {
  constructor(private readonly lightningService: LightningService) {}

  @ApiOperation({
    summary: 'Get Lightning Network statistics.',
  })
  @Get('/statistics')
  async getStatistics(): Promise<MessageResponseDto> {
    return await this.lightningService.getStatistics()
  }

  @ApiOperation({
    summary: 'Get node information.',
  })
  @Get('/node/:pubkey')
  async getNode(@Param() nodeDto: NodeRequestParamsDto): Promise<MessageResponseDto> {
    return await this.lightningService.getNode({ pubkey: nodeDto.pubkey })
  }

  @ApiOperation({
    summary: 'Get Lightning Network top nodes.',
  })
  @Get('/top')
  async getTop(): Promise<MessageResponseDto> {
    return await this.lightningService.getTop()
  }
}
