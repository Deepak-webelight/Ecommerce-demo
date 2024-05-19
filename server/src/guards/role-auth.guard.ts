import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GuardErrorResponse } from '../intercepter/response.intercepter';

export enum Role {
  User,
  Admin,
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly RequiredRole: Role) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const { role } = context.switchToHttp().getRequest();
      return this.RequiredRole === role;
    } catch (err) {
      throw new GuardErrorResponse('Access denied: Forbidden');
    }
  }
}
