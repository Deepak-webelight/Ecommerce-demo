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
import { IsPublicKey } from 'src/utils/constants';

// auth guard
export const PublicRoute = () => SetMetadata(IsPublicKey, true);

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // for public use only
    console.log('authentication guard canActivate');
    const isPublic = this.reflector.getAllAndOverride<boolean>(IsPublicKey, [
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

      //  verify token
      const verifyToken = await this.jwtService.verify(token);

      req['user'] = verifyToken;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Access Denied: Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.cookies.token || request.cookies.refreshToken)?.split(' ') ?? [];

    if (type === 'Bearer' && token) {
      return token;
    } else {
      throw new UnauthorizedException('Token not found');
    }
  }
}
