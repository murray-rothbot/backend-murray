import { Inject, Injectable } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'

@Injectable()
export class AppService {
  constructor(@Inject(REQUEST) private req) {}

  getHello(): string {
    return 'api.murrayrothbot.com'
  }

  getStatusOk() {
    return 'OK'
  }
}
