import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseIntPipe,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { IproductsRouteResponse } from './products.interface';
import { BodyDto, QueryDto } from './products.dto';

@Controller('/products')
export class ProductController {
  constructor(private productservice: ProductService) {}

  @Get('/filters')
  async getAllProducts(
    @Query() query: QueryDto,
    @Body() body: BodyDto,
  ): Promise<IproductsRouteResponse> {
    try {
      
      // Call product service to get filtered products
      const products = await this.productservice.getAllProducts(query, body);

      return {
        data: products,
        message: 'all products',
        statusCode: HttpStatus.OK,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
