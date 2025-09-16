import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateProductDto, UpdateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  listByStore(storeId: string) {
    return this.prisma.prisma.product.findMany({ where: { storeId, active: true } });
  }

  create(data: CreateProductDto) {
    return this.prisma.prisma.product.create({ data });
  }

  update(id: string, data: UpdateProductDto) {
    return this.prisma.prisma.product.update({ where: { id }, data });
  }
}
