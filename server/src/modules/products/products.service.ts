import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { products } from './products.model';
import { Model } from 'mongoose';
import { BodyDto } from './products.dto';
import { IfilterQuery } from './products.interface';
import { defaultPageLimit, defaultPageNumber } from 'src/utils/constants';

@Injectable()
export class ProductService {
  constructor(
    private configService: ConfigService,
    @InjectModel(products.name) private productsModel: Model<products>,
  ) {}
  async getAllProducts(query, body: BodyDto) {
    try {
      // extract default body parameters
      const { name, q } = body;

      const limit = query.limit || defaultPageLimit;
      const skip = limit * (query.page - 1 || defaultPageNumber - 1);

      const filterQuery: IfilterQuery = {};
      if (name) filterQuery.name = name;
      if (q) filterQuery.description = { $regex: q, $options: 'i' };

      console.log('filterQuery', filterQuery);

      // Get Products based on filters
      const products = await this.productsModel
        .find(filterQuery)
        .skip(skip)
        .limit(limit);

      return products;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
