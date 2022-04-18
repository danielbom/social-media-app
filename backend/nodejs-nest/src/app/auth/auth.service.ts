import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '../users/entities/role.enum';
import { User } from '../users/entities/user.entity';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginResponse } from './response/auth-login.response';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async login({
    username,
    password,
  }: AuthLoginDto): Promise<AuthLoginResponse> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new BadRequestException('User and/or password was invalid!');
    }

    if (user.password !== password) {
      throw new BadRequestException('User and/or password was invalid!');
    }

    const token = await this.jwtService.signAsync({ sub: user.id });
    return { token };
  }

  async register({ username, password }: AuthRegisterDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: { username },
    });

    if (userExists) {
      throw new BadRequestException('User already exists!');
    }

    const newUser = this.userRepository.create({
      username,
      password,
      role: Role.USER,
    });
    await this.userRepository.save(newUser);
    return newUser;
  }
}
