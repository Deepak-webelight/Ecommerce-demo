import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsOptional,
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

export class getUserDetailsByIdDto {
  @IsNotEmpty()
  id: string;
}
export class UpdateUserDataRequestBodyDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  readonly password?: string;
}
