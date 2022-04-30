import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashService } from 'src/services/hash/hash.service';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export interface UserAuthDto {
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create({ username, password, role }: CreateUserDto): Promise<User> {
    await this.ensureUserNotExists({ username });

    const hash = await this.hashService.hash(password);
    const user = this.userRepository.create({
      username,
      password: hash,
      role,
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

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) {
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
