import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Role } from './user.roleGuard';

export class SignUpRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;

  @IsNotEmpty()
  @IsEnum(Role)
  @IsString()
  readonly role: keyof typeof Role;
}

export class LoginRequestDto {
  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;
}
