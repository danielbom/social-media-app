import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { env } from 'src/environment';

@WebSocketGateway(env.ws.port, {
  namespace: 'ws',
})
export class AppWsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger = new Logger('WebSocket');

  @WebSocketServer()
  private server: Server;

  afterInit(server: Server) {
    this.logger.log(`WebSocket Server started on port ${env.ws.port}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
