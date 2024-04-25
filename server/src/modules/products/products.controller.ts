import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { IproductsRouteResponse } from './products.interface';
import {
  FilterRequestBodyDto,
  ProductRequestBodyDto,
  PaginationDto,
} from './products.dto';

@Controller('/products')
export class ProductController {
  constructor(private productservice: ProductService) {}

  @Get('/filters')
  async filterProducts(
    @Query() query: PaginationDto,
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

  @Post()
  async createProduct(
    @Body() body: ProductRequestBodyDto,
  ): Promise<IproductsRouteResponse> {
    try {
      // Call product service to create product
      const product = await this.productservice.createProduct(body);

      return {
        data: product,
        message: 'product created successfully',
        statusCode: HttpStatus.CREATED,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get('/:id')
  async getProductById(
    @Param('id') id: string,
  ): Promise<IproductsRouteResponse> {
    try {
      // call product service to extract product data
      const product = await this.productservice.getProductDataById(id);

      return {
        message: 'product data',
        data: product,
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  @Delete('/:id')
  async deleteProductById(
    @Param('id') id: string,
  ): Promise<IproductsRouteResponse> {
    try {
      // call product service to extract product data
      const product = await this.productservice.deleteProductDataById(id);

      console.log(product);
       
      return {
        message: 'product deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
