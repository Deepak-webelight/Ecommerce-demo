import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './products.service';
import { IproductsRouteResponse } from './products.interface';
import {
  FilterRequestBodyDto,
  ProductRequestBodyDto,
  PaginationDto,
} from './products.dto';
import { Role, Roles } from 'src/guards/role-auth.guard';
import { AuthGuard } from 'src/guards/auth.guard';

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
      return this.productservice.getFilterProducts(query, body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post()
  @Roles(Role.Admin)
  @UseGuards(AuthGuard)
  async createProduct(
    @Body() body: ProductRequestBodyDto,
  ): Promise<IproductsRouteResponse> {
    try {
      // Call product service to create product
      return this.productservice.createProduct(body);
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
      return this.productservice.getProductDataById(id);
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
      return this.productservice.deleteProductDataById(id);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
