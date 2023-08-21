import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/role.decorator';
import { RoleConstant } from 'src/modules/role/constant/role.constant';
import { BaseResponse } from 'src/base/response';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles || requiredRoles.length === 0) {
      // No roles are required, so access is allowed
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    if (user.role == RoleConstant.LIST_ROLES.Root) {
      return true;
    }
    const isRole = requiredRoles.some((role) => user.role?.includes(role));
    if (!isRole) {
      BaseResponse.forbidden(
        'Auth Guard',
        `need role: [${Object.values(requiredRoles)}]`,
      );
    }
    return true;
  }
}
