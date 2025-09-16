import { Controller, Get, Param } from '@nestjs/common';

import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get(':id')
  get(@Param('id') id: string) {
    return this.users.findById(id);
  }
}
