import {
  IsEmail,
  IsNotEmpty,
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
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class HeaderDto {
  @IsString()
  @IsNotEmpty()
  readonly 'x-api-key': string;
}
