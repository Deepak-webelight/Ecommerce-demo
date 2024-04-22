import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import mongoose, { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Iconfiguration } from 'src/appConfig/configuration';
import { LoginRequestDto, SignUpRequestBodyDto } from './user.dto';
import { User } from './user.model';
import { createHashPassword, verifyPassword } from 'src/utils/bycrpt';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService<Iconfiguration>,
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
  generateTokens(userId: mongoose.Types.ObjectId) {
    // generate new token and refresh token
    const token = this.jwtService.sign(
      { userId: userId },
      { expiresIn: this.configService.get('tokenExpiry') },
    );
    const refreshToken = this.jwtService.sign(
      { userId: userId },
      {
        expiresIn: this.configService.get('refreshTokenExpiry'),
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
      const refreshToken = req.cookies.refreshToken;
      console.log(req.cookies);

      if (!refreshToken) {
        throw new BadRequestException('No refresh token provided');
      }

      const { userId } = this.jwtService.verify(refreshToken);

      const token = this.jwtService.sign(
        { userId },
        { expiresIn: this.configService.get('tokenExpiry') },
      );

      return token;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
