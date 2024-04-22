import { Type } from 'class-transformer';
import { IsEmpty, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  readonly page?: number;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(50)
  readonly limit?: number;
}

export class BodyDto {
  @IsOptional()
  @IsString()
  @IsEmpty()
  q?: string;

  @IsOptional()
  @IsString()
  @IsEmpty()
  name?: string;
}
