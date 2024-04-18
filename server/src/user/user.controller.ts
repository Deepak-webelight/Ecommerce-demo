import { Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}
  @Post('/sign-up')
  signup(): {
    name: string;
    age: number;
  } {

    return this.userService.registerNewUser('123');
  }

  @Post('/login')
  login(): string {
    return "this.userService.registerNewUser('123');";
  }
}
