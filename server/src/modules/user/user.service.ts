import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  LoginRequestDto,
  SignUpRequestBodyDto,
  UpdateUserDataRequestBodyDto,
} from './user.dto';
import { User } from './user.model';
import { createHashPassword, verifyPassword } from '../../utils/bycrpt';
import {
  IUpdateUserDetailsfilter,
  IauthResponseCookies,
} from './user.interface';
import { Role } from '../../guards/role-auth.guard';
import {
  RefreshTokenExpiry,
  TokenExpiry,
  tokenFormat,
} from '../../utils/constants';
import { cookieConfiguration } from '../../appConfig/configuration';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerUser(body: SignUpRequestBodyDto, res: Response) {
    // Extract data from request body
    const { name, email, password } = body;

    // Validate does user exist
    const isexist = await this.isExist(email);
    if (isexist) throw new BadRequestException('User already exists');

    // create a new hashpassword for the user
    const userHashedPassword = await createHashPassword(password);

    const { _id, role } = await this.userModel.create({
      email,
      name,
      password: userHashedPassword,
    });
    // call generateTokens to return the tokens
    const { refreshToken, token } = this.generateTokens(_id, role);

    // call user service to send cookie
    this.authResponseCookies({
      res,
      refreshToken,
      token,
    });
    return {
      message: 'Signup Successfully',
      statusCode: HttpStatus.CREATED,
    };
  }
  async isExist(email: string) {
    const user = await this.userModel.exists({ email });
    if (user) {
      return true;
    } else {
      return false;
    }
  }
  generateTokens(userId: Types.ObjectId, role: number) {
    // generate new token and refresh token
    const token = this.jwtService.sign(
      { userId, role },
      { expiresIn: TokenExpiry },
    );
    const refreshToken = this.jwtService.sign(
      { userId, role },
      {
        expiresIn: RefreshTokenExpiry,
      },
    );

    return { token, refreshToken };
  }

  async loginUser(body: LoginRequestDto, res: Response) {
    const { email, password } = body;

    // get user details
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Verify the password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    const { refreshToken, token } = this.generateTokens(user._id, user.role);

    // call user service to send cookie
    this.authResponseCookies({
      res,
      token,
      refreshToken,
    });
    return {
      message: 'Login Successfully',
      statusCode: HttpStatus.OK,
    };
  }

  refreshToken(req: Request, res: Response) {
    const { userId, role } = req['user'];
    const token = this.jwtService.sign(
      { userId, role },
      { expiresIn: TokenExpiry },
    );
    this.authResponseCookies({
      res,
      token,
    });

    return {
      message: 'Token refreshed successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getUserById(id: string) {
    if (!id) throw new BadRequestException('id cannot be empty');
    const user = await this.userModel.findById(id, {
      _id: 0,
      role: 0,
      password: 0,
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return {
      message: 'User information fetched successfully',
      data: user,
      statusCode: HttpStatus.OK,
    };
  }

  async updateUserDetails(id: string, body: UpdateUserDataRequestBodyDto) {
    if (!id) throw new BadRequestException('id cannot be empty');

    const { name, password } = body;

    const filterObject: IUpdateUserDetailsfilter = {};
    if (name) filterObject.name = name;

    if (password) {
      const hashpassword = await createHashPassword(password);
      filterObject.password = hashpassword;
    }

    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id: id }, filterObject, { new: true })
      .select('-_id')
      .select('-password')
      .select('-role');

    if (!updatedUser) {
      throw new BadRequestException('User not found');
    }

    return {
      message: 'Updated user details',
      data: updatedUser,
      statusCode: HttpStatus.OK,
    };
  }

  async registerAdminUser(body: SignUpRequestBodyDto, res: Response) {
    // extract data from request body
    const { email, name, password } = body;

    // if User already has existing
    const adminUser = await this.isExist(email);

    if (adminUser) {
      throw new BadRequestException('User already exists');
    }

    // hash password
    const hashpassword = await createHashPassword(password);

    const { _id, role } = await this.userModel.create({
      name,
      email,
      password: hashpassword,
      role: Role.Admin,
    });

    const { refreshToken, token } = this.generateTokens(_id, role);

    // call user service to send cookie
    this.authResponseCookies({
      res,
      token,
      refreshToken,
    });

    return {
      message: 'Admin Created Successfully',
      statusCode: HttpStatus.CREATED,
    };
  }
  async deleteUser(id: string, res: Response) {
    if (!id) throw new BadRequestException('id cannot be empty');

    const deletedUser = await this.userModel.deleteOne({ _id: id });

    if (!deletedUser.deletedCount) {
      throw new BadRequestException('Incorrect user Id');
    }
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return {
      message: 'user deleted',
      statusCode: HttpStatus.OK,
    };
  }
  authResponseCookies(data: IauthResponseCookies) {
    const { res, refreshToken, token } = data;
    if (token) res.cookie('token', tokenFormat(token), cookieConfiguration);
    if (refreshToken)
      res.cookie(
        'refreshToken',
        tokenFormat(refreshToken),
        cookieConfiguration,
      );
  }
  logout(res: Response) {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
    return {
      message: 'User Logout Successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
