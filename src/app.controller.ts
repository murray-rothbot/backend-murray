import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

import { AppService } from './app.service'

@Controller('/')
@ApiTags('Server')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Welcome to the API service.',
  })
  @Get('/')
  getHello(): string {
    return this.appService.getHello()
  }

  @ApiOperation({
    summary: 'Checks the health and availability of the API service.',
  })
  @Get('/health')
  async health() {
    return this.appService.getStatusOk()
  }
}
