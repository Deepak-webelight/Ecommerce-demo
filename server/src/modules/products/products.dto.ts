import { Type } from 'class-transformer';
import {
  IsEmpty,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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

export class FilterRequestBodyDto {
  @IsOptional()
  @IsString()
  @IsEmpty()
  q?: string;

  @IsOptional()
  @IsString()
  @IsEmpty()
  name?: string;
}

export class ProductRequestBodyDto {
  @IsEmpty()
  @IsString()
  name: string;

  @IsEmpty()
  @IsString()
  description: string;

  @IsEmpty()
  @IsNumber()
  price: number;
}
