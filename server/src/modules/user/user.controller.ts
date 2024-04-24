import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  BadRequestException,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { HeaderDto, LoginRequestDto, SignUpRequestBodyDto } from './user.dto';
import { IUserResponse } from './user.interface';
import { tokenFormat } from 'src/utils/constants';
import { PublicRoute } from '../../guards/auth.guard';
import { Role } from 'src/guards/role-auth.guard';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @PublicRoute()
  @Post('sign-up')
  async signup(
    @Body() body: SignUpRequestBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      const { _id } = await this.userService.registerNewUser(body);

      // call UserService to generate new tokens
      const { token, refreshToken } = this.userService.generateTokens(
        _id,
        Role.User,
      );

      res.cookie('token', tokenFormat(token), {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('refreshToken', tokenFormat(refreshToken), {
        httpOnly: true,
        sameSite: 'strict',
      });

      return {
        message: 'User Created Successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  @PublicRoute()
  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      // call user Service to authenticate user
      const { _id, role } = await this.userService.authenticate(body);

      // call UserService to generate new tokens
      const { token, refreshToken } = this.userService.generateTokens(
        _id,
        role,
      );

      res.cookie('token', tokenFormat(token), {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('refreshToken', tokenFormat(refreshToken), {
        httpOnly: true,
        sameSite: 'strict',
      });

      return {
        message: 'User Login Successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      res.clearCookie('token');
      res.clearCookie('refreshToken');

      return {
        message: 'User Logout Successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  @Post('refresh')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      // Call user service to refresh a new token
      const token = await this.userService.refreshToken(req);

      res.cookie('token', tokenFormat(token), {
        httpOnly: true,
        sameSite: 'strict',
      });
      return {
        message: 'Token refreshed successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  @PublicRoute()
  @Post('/admin')
  async createNewAdminUser(
    @Headers() headers: HeaderDto,
    @Body() body: SignUpRequestBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      const xApiKey = headers['x-api-key'];

      if (!xApiKey)
        throw new UnauthorizedException('x-api-key key not provided');

      // call User Service to varify and resister admin user
      const { _id, role } = await this.userService.registerAdminUser(
        xApiKey,
        body,
      );

      const { token, refreshToken } = await this.userService.generateTokens(
        _id,
        role,
      );

      res.cookie('token', tokenFormat(token), {
        httpOnly: true,
        sameSite: 'strict',
      });
      res.cookie('refreshToken', tokenFormat(refreshToken), {
        httpOnly: true,
        sameSite: 'strict',
      });

      return {
        message: 'Admin User Created Successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }
}
