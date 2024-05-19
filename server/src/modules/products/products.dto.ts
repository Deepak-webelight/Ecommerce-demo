import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class PaginationDto {
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
  readonly q?: string;

  @IsOptional()
  @IsString()
  readonly name?: string;
}

export class ProductRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;
}
