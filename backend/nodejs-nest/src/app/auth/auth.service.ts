import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Role } from '../users/entities/role.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginResponse } from './response/auth-login.response';
import { TokenPayload } from './types/token-payload';

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
    return this.userService.create({ username, password, role: Role.USER });
  }
}
