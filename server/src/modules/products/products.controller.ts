import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { IproductsRouteResponse } from './products.interface';
import {
  FilterRequestBodyDto,
  ProductRequestBodyDto,
  QueryDto,
} from './products.dto';

@Controller('/products')
export class ProductController {
  constructor(private productservice: ProductService) {}

  @Get('/filters')
  async filterProducts(
    @Query() query: QueryDto,
    @Body() body: FilterRequestBodyDto,
  ): Promise<IproductsRouteResponse> {
    try {
      // Call product service to get filtered products
      const products = await this.productservice.getFilterProducts(query, body);

      return {
        data: products,
        message: 'all filter products fetched successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('createProduct')
  async createProduct(
    @Body() body: ProductRequestBodyDto,
  ): Promise<IproductsRouteResponse> {
    try {
      // Call product service to create product
      // const product = await this.productservice.createProduct(body);

      return {
        data: body,
        message: 'product created successfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
