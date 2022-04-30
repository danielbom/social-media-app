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
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { Auth } from 'src/decorators/auth.decorator';

import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Auth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto, @AuthUser() user: User) {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  findAll(@AuthUser() user: User) {
    return this.postsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: Uuid, @AuthUser() user: User) {
    return this.postsService.findOne(id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: Uuid,
    @Body() updatePostDto: UpdatePostDto,
    @AuthUser() user: User,
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Uuid, @AuthUser() user: User) {
    return this.postsService.remove(id, user);
  }
}
