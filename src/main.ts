import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './app.module'

import { GenericExceptionsFilter, HttpExceptionFilter } from './shared/filters'
import { ResponseInterceptor } from './shared/interceptors'
import { swaggerConfig } from './config/swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const cfgService = app.get(ConfigService)
  const PORT = cfgService.get<number>('APPLICATION_PORT', 3000)
  const NODE_ENV = cfgService.get<string>('NODE_ENV', 'LOCAL')

  await swaggerConfig(app)

  app.useGlobalInterceptors(new ResponseInterceptor())
  app.useGlobalFilters(new GenericExceptionsFilter(app.get(HttpAdapterHost)))
  app.useGlobalFilters(new HttpExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  await app.listen(PORT).then(() => {
    Logger.log(`:: 🚀 Backend Murray API :: ${NODE_ENV} ::`)
    Logger.log(`:: 💡 API Running on port ${PORT} ::`)
  })
}
bootstrap()
