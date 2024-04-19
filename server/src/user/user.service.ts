import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Iconfiguration } from 'src/appConfig/configuration';
import { SignUpRequestBodyDto } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import mongoose, { Model } from 'mongoose';
import { createHashPassword } from 'src/utils/bycrpt';
@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService<Iconfiguration>,
    @InjectModel(User.name) private userModel: Model<User>,
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
  async generateTokens(userId: mongoose.Types.ObjectId) {
    return { token: '', refreshToken: '' };
  }
}
