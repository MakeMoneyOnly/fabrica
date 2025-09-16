import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('api/products')
export class ProductsController {
  constructor(private products: ProductsService) {}

  @Get('store/:storeId')
  list(@Param('storeId') storeId: string) {
    return this.products.listByStore(storeId);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.products.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.products.update(id, dto);
  }
}
