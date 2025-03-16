import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: CreateUserDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
