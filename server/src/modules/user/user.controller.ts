import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { LoginRequestDto, SignUpRequestBodyDto } from './user.dto';
import { IUserResponse } from './user.interface';
import { tokenFormat } from 'src/utils/constants';
// import { PublicRoute } from '../../guards/auth.guard';
import { cookieConfiguration } from 'src/appConfig/configuration';
import { SuperAdmin } from 'src/guards/superAdmin.auth.guard';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  // @PublicRoute()
  @Post('sign-up')
  async signup(
    @Body() body: SignUpRequestBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      // call user service tp register new user
      const { refreshToken, token } =
        await this.userService.registerNewUser(body);

      res.cookie('token', tokenFormat(token), cookieConfiguration);
      res.cookie(
        'refreshToken',
        tokenFormat(refreshToken),
        cookieConfiguration,
      );

      return {
        message: 'User Created Successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // @PublicRoute()
  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      // call user Service to authenticate user
      const { refreshToken, token } = await this.userService.authenticate(body);

      res.cookie('token', tokenFormat(token), cookieConfiguration);
      res.cookie(
        'refreshToken',
        tokenFormat(refreshToken),
        cookieConfiguration,
      );

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

      res.cookie('token', tokenFormat(token), cookieConfiguration);
      return {
        message: 'Token refreshed successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // @PublicRoute()
  @SuperAdmin()
  @Post('/admin')
  async createNewAdminUser(
    @Body() body: SignUpRequestBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      // call User Service to varify and resister admin user
      const { refreshToken, token } =
        await this.userService.registerAdminUser(body);

      res.cookie('token', tokenFormat(token), cookieConfiguration);
      res.cookie(
        'refreshToken',
        tokenFormat(refreshToken),
        cookieConfiguration,
      );

      return {
        message: 'Admin User Created Successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }
}
