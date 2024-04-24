import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import appConfig from 'src/appConfig/configuration';

export enum Role {
  User,
  Admin,
}

// Role decorator
export const Roles = (roles: Role) => SetMetadata(appConfig('ROLES_KEY'), roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        appConfig('ROLES_KEY'),
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }
      const { user } = context.switchToHttp().getRequest();

      return requiredRoles === user.role;
    } catch (err) {
      throw new UnauthorizedException('Access denied: Forbidden');
    }
  }
}
// @Roles(Role.Admin)
