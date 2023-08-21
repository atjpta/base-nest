import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketManagerService } from './socket_manager.service';
import { UserService } from '../user/user.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SocketManagerConstant } from './constant/socket_manager.constant';
import { BaseResponse } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';

@WebSocketGateway({ cors: true })
export class SocketManagerGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger: Logger = new Logger(SocketManagerGateway.name);
  constructor(
    private readonly _modelService: SocketManagerService,
    private readonly _userService: UserService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    this.server.emit(
      SocketManagerConstant.EMIT_EVENT.CONNECTED_CLIENTS,
      BaseResponse.success({
        statusCode: BaseHttpStatus.OK,
        object: SocketManagerConstant.EMIT_EVENT.CONNECTED_CLIENTS,
        data: 'Connection',
      }),
    );
    return client.id;

    const user = await this._modelService.checkAuth(client);
    if (user) {
      client.handshake.auth.user = user;
    }
    await this._modelService.setNewSocket(user.id, client);
    this.broadcastConnectedClients();
  }
  async handleDisconnect(client: Socket) {
    return client.id;

    await this._modelService.removeSocket(
      client.handshake.auth.user.id,
      client,
    );

    this.logger.log(`disconnected: ${client.id}`);
    this.broadcastConnectedClients();
  }
  private async broadcastConnectedClients() {
    const data = [];
    this._modelService.listUserOnline.forEach((e) => {
      data.push(e);
    });
    this.server.emit(
      SocketManagerConstant.EMIT_EVENT.CONNECTED_CLIENTS,
      BaseResponse.success({
        statusCode: BaseHttpStatus.OK,
        object: SocketManagerConstant.EMIT_EVENT.CONNECTED_CLIENTS,
        data,
      }),
    );
  }
}
