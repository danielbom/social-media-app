import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './entities/role.enum';
import { User } from './entities/user.entity';

export interface UserAuthDto {
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create({ username, password }: CreateUserDto): Promise<User> {
    await this.ensureUserNotExists({ username });

    const user = this.userRepository.create({
      username,
      password,
      role: Role.USER,
    });

    await this.userRepository.save(user);

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: Uuid): Promise<User> {
    return this.userRepository.findOne({ where: { id } });
  }

  async update(id: Uuid, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.getUserOrThrow({ id });

    for (const key in updateUserDto) {
      user[key] = updateUserDto[key];
    }

    await this.userRepository.save(user);

    return user;
  }

  async remove(id: Uuid): Promise<void> {
    const user = await this.getUserOrThrow({ id });

    await this.userRepository.softDelete({ id: user.id });
  }

  async getAuthenticated({ username, password }: UserAuthDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user === null) {
      throw new BadRequestException('User and/or password was invalid!');
    }

    if (user.password !== password) {
      throw new BadRequestException('User and/or password was invalid!');
    }

    return user;
  }

  async ensureUserNotExists(where: Partial<User>) {
    const user = await this.userRepository.findOne({ where });

    if (user !== null) {
      throw new BadRequestException('User already exists!');
    }
  }

  async getUserOrThrow(where: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({ where });

    if (user === null) {
      throw new BadRequestException('User not exists!');
    }

    return user;
  }
}
