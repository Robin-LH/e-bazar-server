import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  create(@Body() cart: { userIP: string; product: string }): Promise<string> {
    return this.cartService.create(cart);
  }

  @Get()
  findAll(@Query('agent') agent: string) {
    return this.cartService.findAll(agent);
  }

  @Patch(':userIP')
  update(
    @Param('userIP') userIP: string,
    @Body() payload: { productID: string; quantity: number },
  ) {
    return this.cartService.update(userIP, payload);
  }

  @Delete(':userIP')
  remove(@Param('userIP') userIP: string, @Query('product') product: string) {
    return this.cartService.remove(userIP, product);
  }
}
