import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @ApiProperty({ example: 'user_53', description: 'username of user' })
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ example: 'password12345', description: 'password of user' })
  password: string;
}
