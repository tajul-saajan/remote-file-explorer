import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.userService.findOne(username);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); // ✅ Compare password
    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
