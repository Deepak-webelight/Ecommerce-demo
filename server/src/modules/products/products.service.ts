import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { products } from './products.model';
import { Model } from 'mongoose';
import {
  FilterRequestBodyDto,
  PaginationDto,
  ProductRequestBodyDto,
} from './products.dto';
import { IfilterQuery } from './products.interface';
import { defaultPageLimit, defaultPageNumber } from 'src/utils/constants';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(products.name) private productsModel: Model<products>,
  ) {}

  async getFilterProducts(query: PaginationDto, body: FilterRequestBodyDto) {
    // extract request body parameters
    const { name, q } = body;

    // set up pagination parameters
    const limit = query.limit || defaultPageLimit;
    const skip = limit * (query.page - 1 || defaultPageNumber - 1);

    // mongodb filter query
    const filterQuery: IfilterQuery = {};
    if (name) filterQuery.name = name;
    if (q) filterQuery.description = { $regex: q, $options: 'i' };

    // extract data and return it
    const products = await this.productsModel
      .find(filterQuery)
      .skip(skip)
      .limit(limit);

    return {
      data: products,
      message: 'filtered products',
      statusCode: HttpStatus.OK,
    };
  }

  async getProductDataById(id: string) {
    const product = await this.productsModel.findById(id);
    if (!product) throw new BadRequestException(`Product not found`);

    return {
      message: 'product data',
      data: product,
      statusCode: HttpStatus.OK,
    };
  }
  async createProduct(body: ProductRequestBodyDto) {
    const product = await this.productsModel.create(body);
    return {
      data: product,
      message: 'product created',
      statusCode: HttpStatus.CREATED,
    };
  }
  async deleteProductDataById(id: string) {
    const product = await this.productsModel.findByIdAndDelete(id);
    if (!product) throw new BadRequestException(`Product not found`);

    return {
      message: 'product deleted',
      statusCode: HttpStatus.OK,
    };
  }
}
