import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Auth } from 'src/decorators/auth.decorator';
import { Role } from 'src/entities/role.enum';
import { User } from 'src/entities/user.entity';
import { Queryable } from 'src/lib/query-filters';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Auth([Role.ADMIN])
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Queryable({})
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Queryable({ pagination: false })
  findOne(@Param('id') id: Uuid) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Uuid,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.usersService.remove(id);
  }
}
