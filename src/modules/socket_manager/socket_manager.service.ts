import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { RoleService } from '../role/role.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SocketManagerService {
  constructor(
    private readonly _jwtService: JwtService,
    private roleService: RoleService,
    private userService: UserService,
  ) {}
  listUserOnline = new Map<string, Set<string>>();

  public async decodeTokenJWT(token: string): Promise<any> {
    const result = this._jwtService.verify(token);
    return result;
  }

  public async setNewSocket(id: string, socket: Socket) {
    const listSocket = this.listUserOnline.get(id);
    if (listSocket?.size > 0) {
      listSocket.add(socket.id);
    } else {
      this.listUserOnline.set(id, new Set(socket.id));
      await this.userService.update(id, { isOnline: true });
    }
  }
  public async removeSocket(id: string, socket: Socket) {
    const listSocket = this.listUserOnline.get(id);

    if (listSocket.size < 1) {
      this.listUserOnline.delete(id);
      await this.userService.update(id, { isOnline: false });
    } else {
      listSocket.delete(socket.id);
    }
  }

  public async checkAuth(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (token && token.split(' ')[1]) {
        const userDecode = await this.decodeTokenJWT(token.split(' ')[1]);
        if (!userDecode) {
          return null;
        }
        return {
          id: userDecode.userId,
          role: userDecode.role,
        };
      }
    } catch (error) {
      return null;
    }
  }
}
