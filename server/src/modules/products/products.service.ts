import { BadRequestException, Injectable } from '@nestjs/common';
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
    try {
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
      return await this.productsModel.find(filterQuery).skip(skip).limit(limit);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async getProductDataById(id: string) {
    try {
      const product = await this.productsModel.findById(id);

      if (!product) throw new BadRequestException(`Product not found`);

      return product;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async createProduct(body: ProductRequestBodyDto) {
    try {
      return await this.productsModel.create(body);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
  async deleteProductDataById(id: string) {
    try {
      const product = await this.productsModel.findByIdAndDelete(id);
      console.log(product);
      if (!product) throw new BadRequestException(`Product not found`);

      return product;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
