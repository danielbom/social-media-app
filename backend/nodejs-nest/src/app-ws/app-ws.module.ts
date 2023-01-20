import { Module } from '@nestjs/common'
import { AppWsGateway } from './app-ws.gateway'

@Module({
  providers: [AppWsGateway],
  exports: [AppWsGateway],
})
export class AppWsModule {}
