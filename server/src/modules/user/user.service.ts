import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginRequestDto, SignUpRequestBodyDto } from './user.dto';
import { User } from './user.model';
import { createHashPassword, verifyPassword } from 'src/utils/bycrpt';
import { Role } from '../../guards/role-auth.guard';
import { RefreshTokenExpiry, TokenExpiry } from 'src/utils/constants';

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

      const { _id, role } = await this.userModel.create({
        email,
        name,
        password: userHashedPassword,
      });
      // call generateTokens to return the tokens
      return this.generateTokens(_id, role);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async isExist(email: string) {
    const user = await this.userModel.exists({ email });
    console.log(user)
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

      return this.generateTokens(user._id, user.role);
    } catch (err) {
      throw new BadRequestException(err.message || 'Authentication failed');
    }
  }

  async refreshToken(req: Request) {
    try {
      const { userId, role } = req['user'];

      const token = this.jwtService.sign(
        { userId, role },
        { expiresIn: TokenExpiry },
      );

      return token;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async registerAdminUser(body: SignUpRequestBodyDto) {
    try {
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

      return this.generateTokens(_id, role);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
