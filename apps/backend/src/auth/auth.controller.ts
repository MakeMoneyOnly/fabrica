import { Body, Controller, Post, Get, UseGuards, Request } from '@nestjs/common';

import { Public } from './public.decorator';
import { JwtAuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.auth.register(dto.email, dto.password, dto.name);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Request() req: { user: { id: string; email: string } }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req: { user: { id: string; email: string } }) {
    const user = req.user;
    return this.auth.refreshToken(user.id, user.email);
  }
}
