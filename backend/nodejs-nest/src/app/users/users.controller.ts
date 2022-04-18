import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AuthUser } from 'src/decorators/auth-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@AuthUser() user) {
    console.log(user);
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Uuid) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: Uuid, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Uuid) {
    return this.usersService.remove(id);
  }
}
