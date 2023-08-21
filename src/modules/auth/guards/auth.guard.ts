import { Reflector } from '@nestjs/core';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { BaseResponse } from 'src/base/response';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const requiredPublic = this.reflector.getAllAndOverride<string[]>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredPublic) {
      return true;
    }
    const token = request.headers.authorization;
    if (token && token.split(' ')[1]) {
      try {
        const userDecode = await this.authService.decodeTokenJWT(
          token.split(' ')[1],
        );

        if (!userDecode) {
          return BaseResponse.tokenExpired('Auth Guard');
        }
        const { userId, role } = userDecode;
        request.user = {
          id: userId,
          role: role,
        };
        return true;
      } catch (error) {
        if (error.name == 'TokenExpiredError') {
          return BaseResponse.tokenExpired('Auth Guard');
        }
        return BaseResponse.unauthorized('JwtAuthGuard', 'error JWT');
      }
    }
    return BaseResponse.unauthorized('Auth Guard'); // success
  }
}
