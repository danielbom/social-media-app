import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../users/entities/role.enum';
import { User } from '../users/entities/user.entity';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginResponse } from './response/auth-login.response';

let idCount = 2;
const users: Record<string, User> = {
  '1': {
    id: '1',
    username: 'admin',
    password: 'senh@zona',
    role: Role.ADMIN,
    comments: [],
    posts: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(authLoginDto: AuthLoginDto): Promise<AuthLoginResponse> {
    const user = Object.values(users).find(
      (x) => x.username === authLoginDto.username,
    );

    if (!user || user.password !== authLoginDto.password) {
      throw new BadRequestException('User and/or password was invalid!');
    }

    const token = await this.jwtService.signAsync({ sub: user.id });
    return { token };
  }

  async register(authRegisterDto: AuthRegisterDto): Promise<User> {
    const user = Object.values(users).find(
      (x) => x.username === authRegisterDto.username,
    );

    if (user) {
      throw new BadRequestException('User already exists!');
    }

    const newUser: User = {
      id: idCount.toString(),
      username: authRegisterDto.username,
      password: authRegisterDto.password,
      role: Role.USER,
      comments: [],
      posts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    idCount++;
    users[newUser.id] = newUser;

    return newUser;
  }
}
