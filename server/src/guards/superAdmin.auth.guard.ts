import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { appConfig } from '../appConfig/configuration';
import { GuardErrorResponse } from '../intercepter/response.intercepter';

@Injectable()
export class SuperAdminAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const ReqxApiKey = req.headers['x-api-key'];

      if (ReqxApiKey === appConfig.adminApiKey) {
        return true;
      }
      return false;
    } catch (err) {
      throw new GuardErrorResponse(err.message);
    }
  }
}
