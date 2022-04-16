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

  async findOne(id: Uuid): Promise<User> {
    return {} as any;
  }

  async update(id: Uuid, updateUserDto: UpdateUserDto): Promise<User> {
    return {} as any;
  }

  async remove(id: Uuid): Promise<void> {
    throw new MethodNotAllowedException();
  }
}
