import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpRequestBodyDto } from './user.dto';
import { User } from './user.schema';

interface IUserResponse {
  message: string;
  data: any;
}

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/sign-up')
  async signup(@Body() body: SignUpRequestBodyDto): Promise<IUserResponse> {
    // call UserService to register the user
    const { _id } = await this.userService.registerNewUser(body);

    // call UserService to generate new tokens
    const { token, refreshToken } = await this.userService.generateTokens(_id);

    return {
      data: { token, refreshToken },
      message: 'User Created Successfully',
    };
  }

  @Post('/login')
  login(): string {
    return "this.userService.registerNewUser('123');";
  }
}
