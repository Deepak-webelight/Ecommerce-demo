import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  BadRequestException,
  Get,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import {
  LoginRequestDto,
  SignUpRequestBodyDto,
  UpdateUserDataRequestBodyDto,
} from './user.dto';
import { IUserResponse } from './user.interface';
import { PublicRoute } from '../../guards/auth.guard';
import { SuperAdminAuthGuard } from '../../guards/superAdmin.auth.guard';
import { User } from './user.model';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}
  // create a new user
  @PublicRoute()
  @Post('sign-up')
  async signup(
    @Body() body: SignUpRequestBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse<void>> {
    try {
      // call user service to register new user and allow authentication
      return this.userService.registerUser(body, res);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // login an existing user
  @PublicRoute()
  @Post('login')
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse<void>> {
    try {
      // call user Service to authenticate user
      return this.userService.loginUser(body, res);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // admin user
  @PublicRoute()
  @UseGuards(SuperAdminAuthGuard)
  @Post('/admin')
  async createNewAdminUser(
    @Body() body: SignUpRequestBodyDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse<void>> {
    try {
      // call User Service to varify and resister admin user and allow authentication
      return this.userService.registerAdminUser(body, res);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // logout an existing user
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    try {
      return this.userService.logout(res);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // refresh an expired token
  @Post('refresh')
  refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): IUserResponse<void> {
    try {
      // Call user service to refresh a new token
      return this.userService.refreshToken(req, res);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // get user information by id
  @Get()
  async getUserById(@Query('id') id: string): Promise<IUserResponse<User>> {
    try {
      // call user service to extract user information
      return this.userService.getUserById(id);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  // update user details
  @Patch()
  async updateUserDetails(
    @Query('id') id: string,
    @Body() body: UpdateUserDataRequestBodyDto,
  ): Promise<IUserResponse<User>> {
    try {
      // call user service to find and update user id
      return this.userService.updateUserDetails(id, body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  // delete user
  @Delete()
  async deleteUser(
    @Query('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse<void>> {
    try {
      // call user service to find and delete user
      return this.userService.deleteUser(id, res);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
