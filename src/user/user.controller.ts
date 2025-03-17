// src/users/users.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './create-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: 201,
    description: 'user returned',
    schema: {
      example: {
        username: 'tajul1',
        id: 4,
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'user already exists',
    schema: {
      example: { statusCode: 400, message: 'User already exists' },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
