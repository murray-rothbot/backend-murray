import { Query, Controller, Get, Injectable, Param } from '@nestjs/common'
import { BlockchainService } from './blockchain.service'
import { AddressRequestParamsDto, BlockRequestDto, TransactionRequestDto } from './dto'
import { MessageResponseDto } from '../../shared/dtos'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Injectable()
@Controller('blockchain')
@ApiTags('Blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @ApiOperation({
    summary: 'Get address information.',
  })
  @Get('/address/:address')
  async getAddress(@Param() addressDto: AddressRequestParamsDto): Promise<MessageResponseDto> {
    return await this.blockchainService.getAddress({
      address: addressDto.address,
    })
  }

  @ApiOperation({
    summary: 'Get block information.',
  })
  @Get('/block')
  async getBlock(@Query() blockDto: BlockRequestDto): Promise<MessageResponseDto> {
    return await this.blockchainService.getBlock({
      hash: blockDto?.hash,
      height: blockDto?.height,
    })
  }

  @ApiOperation({
    summary: 'Get difficulty information.',
  })
  @Get('/difficulty')
  async getHashrate(): Promise<MessageResponseDto> {
    return this.blockchainService.getDifficulty()
  }

  @ApiOperation({
    summary: 'Get halving information.',
  })
  @Get('/halving')
  async getHalving(): Promise<MessageResponseDto> {
    return this.blockchainService.getHalving()
  }

  @ApiOperation({
    summary: 'Get recommended fees information.',
  })
  @Get('/fees/recommended')
  async getFeesRecommended(): Promise<MessageResponseDto> {
    return await this.blockchainService.getFeesRecommended()
  }

  @ApiOperation({
    summary: 'Get transaction information.',
  })
  @Get('/tx/:transaction')
  async getTransaction(@Param() txDto: TransactionRequestDto): Promise<MessageResponseDto> {
    return await this.blockchainService.getTransaction({
      transaction: txDto.transaction,
    })
  }
}
