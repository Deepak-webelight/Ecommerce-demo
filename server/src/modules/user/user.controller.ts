import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Req,
  BadRequestException,
  Get,
  Param,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import {
  LoginRequestDto,
  SignUpRequestBodyDto,
  getUserDetailsByidDto,
} from './user.dto';
import { IUserResponse } from './user.interface';
import { tokenFormat } from 'src/utils/constants';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}
  // create a new user
  @Post('sign-up')
  async signup(
    @Body() body: SignUpRequestBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      // call UserService to register the user
      const { _id } = await this.userService.registerNewUser(body);

      // call UserService to generate new tokens
      const { token, refreshToken } = this.userService.generateTokens(_id);

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

  // login an existing user
  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      // call user Service to authenticate user
      const { _id } = await this.userService.authenticate(body);

      // call UserService to generate new tokens
      const { token, refreshToken } = this.userService.generateTokens(_id);

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

  // logout an existing user
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

  // refresh an expired token
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

  // get user information by id
  @Get('/:id')
  async getUserById(
    @Param() param: getUserDetailsByidDto,
  ): Promise<IUserResponse> {
    try {
      console.log('getUserById', param);
      // call user service to extract user information
      // const user = await this.userService.getUserById(id);

      return {
        message: 'User information fetched successfully',
        // data: user,
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
