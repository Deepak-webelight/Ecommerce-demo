import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/utils/constants';

// auth guard
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('guard worded here ');
    // for public use only
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // switch context to request
    const req: Request = context.switchToHttp().getRequest();

    try {
      //   Extract token from request
      const token = this.extractTokenFromHeader(req);

      if (!token) {
        throw new UnauthorizedException();
      }

      //  veryfy token
      const verifyToken = await this.jwtService.verify(token);

      req['user'] = verifyToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Expired token | Not found');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.cookies.token || request.cookies.refreshToken)?.split(' ') ?? [];
    return type === 'Bearer' ? token || false : undefined;
  }
}
