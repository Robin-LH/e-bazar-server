import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './product.schema';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: mongoose.Model<Product>,
  ) {}

  async create(payload: Product): Promise<Product> {
    const product = await this.productModel.create(payload);
    return product;
  }

  async findAll(pageNo: string, perPage: string, query: string) {
    const pagination = {
      page: Number(pageNo) || 1,
      perPage: Number(perPage) || 5,
    };

    const skip = (pagination.page - 1) * pagination.perPage;

    const products = await this.productModel
      .find({ title: { $regex: `${query}`, $options: 'i' } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pagination.perPage);

    const productsLength = await this.productModel.count();

    return {
      slice: `${skip + 1}-${products.length * (skip + 1)}`,
      total: productsLength,
      products,
    };
  }

  async findOne(id: string) {
    try {
      const product = await this.productModel.findById(id);
      if (!product) {
        throw new HttpException(`Not found`, HttpStatus.NOT_FOUND);
      }
      return product;
    } catch (error) {
      return 'Product fatching failed';
    }
  }

  async remove(id: number) {
    try {
      await this.productModel.findOneAndDelete({ _id: id });
      return `Product deleted successful.`;
    } catch (error) {
      return 'Product delated failed';
    }
  }
}
