import { Controller, Get, Param } from '@nestjs/common';

import { StoresService } from './stores.service';

@Controller('api/stores')
export class StoresController {
  constructor(private stores: StoresService) {}

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.stores.getWithProducts(slug);
  }
}
