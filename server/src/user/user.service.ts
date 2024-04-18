import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  registerNewUser(userId: string) {
    return {
      name: 'Deepak',
      age: 20,
    };
  }
}
