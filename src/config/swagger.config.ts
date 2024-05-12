import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger'
import swaggerCss from './swagger'

export const swaggerConfig = async function conf(app: INestApplication): Promise<void> {
  const cfgService = app.get(ConfigService)
  const config = new DocumentBuilder()
    .setTitle(cfgService.get<string>('APPLICATION_NAME', ''))
    .setDescription(cfgService.get<string>('APPLICATION_DESCRIPTION', ''))
    .setVersion(cfgService.get<string>('APPLICATION_VERSION', ''))
    .addTag('Blockchain', 'Endpoints for blockchain information.')
    .addTag('Lightning', 'Endpoints for lightning information.')
    .addTag('Prices', 'Endpoints for prices and markets information.')
    .addTag('Server', 'Essential endpoints for monitoring and checking the APIs status.')
    .build()

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  }
  const document = SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup('swagger', app, document, {
    customSiteTitle: 'Backend-Murray | API Documentation',
    customCss: swaggerCss,
    swaggerOptions: {
      apisSorter: 'alpha',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  })
}
