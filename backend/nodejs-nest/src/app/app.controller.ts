import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger/dist'
import { AppService } from './app.service'

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ type: String, description: 'Health check' })
  @Get()
  healthCheck(): string {
    return this.appService.healthCheck()
  }
}
