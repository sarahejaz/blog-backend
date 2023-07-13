import { Body, Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedGuard } from './authenticated.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('login')
  async login(
    @Body('password') password: string,
    @Body('email') email: string
  ) {
    return this.authService.login({ email, password });
  }
}
