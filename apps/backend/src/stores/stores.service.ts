import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  getBySlug(slug: string) {
    return this.prisma.prisma.store.findUnique({ where: { slug } });
  }

  getWithProducts(slug: string) {
    return this.prisma.prisma.store.findUnique({
      where: { slug },
      include: { products: { where: { active: true } } },
    });
  }
}
