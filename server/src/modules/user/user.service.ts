import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginRequestDto, SignUpRequestBodyDto } from './user.dto';
import { User } from './user.model';
import { createHashPassword, verifyPassword } from 'src/utils/bycrpt';
import { Role } from '../../guards/role-auth.guard';
import appConfig from 'src/appConfig/configuration';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async registerNewUser(body: SignUpRequestBodyDto) {
    try {
      // Extract data from request body
      const { name, email, password } = body;

      // Validate does user exist
      const isexist = await this.isExist(email);
      if (isexist) throw new BadRequestException('User already exists');

      // create a new hashpassword for the user
      const userHashedPassword = await createHashPassword(password);

      const user = await this.userModel.create({
        email,
        name,
        password: userHashedPassword,
        role: Role.User, // by default user role only
      });

      return user;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async isExist(email: string) {
    const user = await this.userModel.findOne({ email });
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
      { expiresIn: appConfig('TOKEN_EXPIRY') },
    );
    const refreshToken = this.jwtService.sign(
      { userId, role },
      {
        expiresIn: appConfig('REFRESH_TOKEN_EXPIRY'),
      },
    );

    return { token, refreshToken };
  }

  async authenticate(body: LoginRequestDto) {
    try {
      const { email, password } = body;

      // Check if the user exists
      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Verify the password
      const isPasswordValid = await verifyPassword(password, user.password);

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      return user;
    } catch (err) {
      throw new BadRequestException(err.message || 'Authentication failed');
    }
  }

  async refreshToken(req: Request) {
    try {
      const { userId, role } = req['user'];

      const token = this.jwtService.sign(
        { userId, role },
        { expiresIn: appConfig('TOKEN_EXPIRY') },
      );

      return token;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async registerAdminUser(apiKey: string, body: SignUpRequestBodyDto) {
    try {
      // validate valid api key
      const varify = apiKey === appConfig('X_API_KEY');
      if (!varify) throw new BadRequestException('Invalid api key');

      // extract data from request body
      const { email, name, password } = body;

      // if User already has existing

      const adminUser = await this.isExist(email);

      if (adminUser) {
        throw new BadRequestException('User already exists');
      }

      // hash password
      const hashpassword = await createHashPassword(password);

      return await this.userModel.create({
        name,
        email,
        password: hashpassword,
        role: Role.Admin,
      });
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
