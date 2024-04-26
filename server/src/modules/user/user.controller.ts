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
  Patch,
  Delete,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import {
  LoginRequestDto,
  SignUpRequestBodyDto,
  UpdateUserDataRequestBodyDto,
  getUserDetailsByIdDto,
} from './user.dto';
import { IUserResponse } from './user.interface';
import { tokenFormat } from 'src/utils/constants';
import { PublicRoute } from '../../guards/auth.guard';
import { cookieConfiguration } from 'src/appConfig/configuration';
import { SuperAdmin } from 'src/guards/superAdmin.auth.guard';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}
  
  // create a new user
  @PublicRoute()
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

  // login an existing user
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

      res.cookie('token', tokenFormat(token), cookieConfiguration);
      return {
        message: 'Token refreshed successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // get user information by id
  @Get(':id')
  async getUserById(
    @Param() { id }: getUserDetailsByIdDto,
  ): Promise<IUserResponse> {
    try {
      // call user service to extract user information
      const user = await this.userService.getUserById(id);

      return {
        message: 'User information fetched successfully',
        data: user,
        status: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
  @Patch(':id')
  async updateUserDetails(
    @Param() { id }: getUserDetailsByIdDto,
    @Body() body: UpdateUserDataRequestBodyDto,
  ): Promise<IUserResponse> {
    try {
      // call user service to find and update user id
      const updatedUser = await this.userService.updateUserDetails(id, body);
      console.log(updatedUser, 'updatedUser');
      return {
        message: 'Updated user details',
        data: updatedUser,
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }

  @Delete('/:id')
  async deleteUser(
    @Param() { id }: getUserDetailsByIdDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    try {
      // call user service to find and delete user

      const deletedUser = await this.userService.deleteUser(id);

      if (!deletedUser.deletedCount) {
        throw new BadRequestException('Incorrect user Id');
      }
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      return {
        message: 'user deleted',
      };
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
