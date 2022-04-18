import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from 'src/strategies/passport-jwt.strategy';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginResponse } from './response/auth-login.response';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async login({
    username,
    password,
  }: AuthLoginDto): Promise<AuthLoginResponse> {
    const user = await this.userService.getAuthenticated({
      username,
      password,
    });
    const payload: TokenPayload = { sub: user.id };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }

  async register({ username, password }: AuthRegisterDto): Promise<User> {
    return this.userService.create({ username, password });
  }
}
