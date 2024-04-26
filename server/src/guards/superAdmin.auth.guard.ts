import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { appConfig } from 'src/appConfig/configuration';
import { SuperAdminKey } from 'src/utils/constants';

export const SuperAdmin = () => SetMetadata(SuperAdminKey, true);

@Injectable()
export class SuperAdminAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const isSuperAdmin = this.reflector.getAllAndOverride<boolean>(
        SuperAdminKey,
        [context.getHandler(), context.getClass()],
      );
      if (!isSuperAdmin) return true;

      const req = context.switchToHttp().getRequest();
      const ReqxApiKey = req.headers['x-api-key'];

      if (ReqxApiKey !== appConfig.xApiKey) {
        return false;
      }
      return true;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
