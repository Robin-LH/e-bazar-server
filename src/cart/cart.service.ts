import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './cart.schema';
import mongoose from 'mongoose';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name)
    private cartModel: mongoose.Model<Cart>,
  ) {}

  async create(payload: { product: string; userIP: string }): Promise<string> {
    try {
      const existCart = await this.cartModel.findOne({
        userIP: payload.userIP,
      });

      if (!existCart) {
        const createdCart = new this.cartModel({
          userIP: payload.userIP,
          products: [{ product: payload.product, quantity: 1 }],
        });
        await createdCart.save();
        return 'Added to Cart successfully.';
      } else {
        await this.cartModel.updateOne(
          { userIP: payload.userIP },
          { $push: { products: { product: payload.product, quantity: 1 } } },
        );

        return 'Added to Cart successfully.';
      }
    } catch (error) {
      console.log('cart create failed for ==> ', error);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(agent: string) {
    try {
      if (!agent)
        throw new HttpException('Agent must need', HttpStatus.BAD_REQUEST);

      const cart = await this.cartModel.findOne({ userIP: agent }).populate({
        path: 'products',
        populate: {
          path: 'product',
          model: 'Product',
        },
      });

      if (!cart)
        throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);

      return cart.products;
    } catch (error) {
      if (error.status === 404)
        throw new HttpException(error.response, HttpStatus.NOT_FOUND);

      if (error.status === 400)
        throw new HttpException(error.response, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    userIP: string,
    payload: { productID: string; quantity: number },
  ) {
    try {
      const isCartExist = await this.cartModel.findOne({ userIP });

      if (!isCartExist)
        throw new HttpException('Cart not found', HttpStatus.FORBIDDEN);

      const doc = await this.cartModel.findOne({ userIP });

      const products = doc.products.map((p: any) => {
        if (p.product === payload.productID) {
          return { ...p, quantity: payload.quantity };
        }
        return p;
      });

      doc.products = products;
      await doc.save();

      return 'Success';
    } catch (error) {
      console.log(error);

      if (error.status === 403)
        throw new HttpException(error.response, HttpStatus.FORBIDDEN);

      if (error.status === 400)
        throw new HttpException(error.response, HttpStatus.NOT_FOUND);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(userIP: string, product: any) {
    try {
      if (!product)
        throw new HttpException('Agent must need', HttpStatus.BAD_REQUEST);

      await this.cartModel.findOneAndUpdate(
        { userIP },
        { $pull: { products: { product } } },
        { safe: true },
      );

      return 'Product deleted';
    } catch (error) {
      if (error.status === 400)
        throw new HttpException(error.response, HttpStatus.BAD_REQUEST);

      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
