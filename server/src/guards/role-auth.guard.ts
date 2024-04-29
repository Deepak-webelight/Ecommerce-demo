import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GuardErrorResponse } from '../intercepter/response.intercepter';
import { RolesKey } from '../utils/constants';

export enum Role {
  User,
  Admin,
}

// Role decorator
export const Roles = (role: Role) => SetMetadata(RolesKey, role);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(RolesKey, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (!requiredRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();

      return requiredRoles === user.role;
    } catch (err) {
      throw new GuardErrorResponse('Access denied: Forbidden');
    }
  }
}
// @Roles(Role.Admin)
