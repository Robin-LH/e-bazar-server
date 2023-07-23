import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.schema';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  create(@Body() product: Product): Promise<Product> {
    return this.productsService.create(product);
  }

  @Get()
  @ApiQuery({
    name: 'pageNo',
    required: false,
    description:
      'By default pageNo is 1. You may change page number for pagination',
  })
  @ApiQuery({ name: 'perPage', required: false, description: 'By default 8' })
  @ApiQuery({
    name: 'query',
    required: false,
    description: 'Find products by keyword',
  })
  findAll(
    @Query('pageNo') pageNo: string,
    @Query('perPage') perPage: string,
    @Query('query') query: string,
  ): Promise<{ products: Product[]; total: number }> {
    return this.productsService.findAll(pageNo, perPage, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
