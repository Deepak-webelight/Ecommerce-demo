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
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import {
  LoginRequestDto,
  SignUpRequestBodyDto,
  UpdateUserDataRequestBodyDto,
} from './user.dto';
import { IUserResponse } from './user.interface';
import { SuperAdminAuthGuard } from '../../guards/superAdmin.auth.guard';
import { User } from './user.model';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  // create a new user
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
  @Post('/admin')
  @UseGuards(SuperAdminAuthGuard)
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
  @UseGuards(AuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      return this.userService.logout(res);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // refresh an expired token
  @Post('refresh')
  @UseGuards(AuthGuard)
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse<void>> {
    try {
      // Call user service to refresh a new token
      return this.userService.refreshToken(req, res);
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  // get user details by id
  @Get()
  @UseGuards(AuthGuard)
  async getUserById(@Req() req: Request): Promise<IUserResponse<User>> {
    try {
      // call user service to extract user information
      return this.userService.getUserById(req);
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  // update user details
  @Patch()
  @UseGuards(AuthGuard)
  async updateUserDetails(
    @Req() req: Request,
    @Body() body: UpdateUserDataRequestBodyDto,
  ): Promise<IUserResponse<User>> {
    try {
      // call user service to find and update user id
      return this.userService.updateUserDetails(req, body);
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  // delete user
  @Delete()
  @UseGuards(AuthGuard)
  async deleteUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse<void>> {
    try {
      // call user service to find and delete user
      return this.userService.deleteUser(req, res);
    } catch (err) {
      throw new BadRequestException(err.response);
    }
  }
}
