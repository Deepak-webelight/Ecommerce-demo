import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignUpRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsStrongPassword()
  readonly password: string;
}

export class LoginRequestDto {
  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;
}

export class getUserDetailsByidDto {
  @IsNumberString()
  @IsNotEmpty()
  id: string;
}
