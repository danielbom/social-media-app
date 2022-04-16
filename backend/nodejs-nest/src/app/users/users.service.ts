import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  async create(createUserDto: CreateUserDto): Promise<User> {
    return {} as any;
  }

  async findAll(): Promise<User[]> {
    return [];
  }

  async findOne(id: string): Promise<User> {
    return {} as any;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return {} as any;
  }

  async remove(id: string): Promise<void> {
    throw new MethodNotAllowedException();
  }
}
