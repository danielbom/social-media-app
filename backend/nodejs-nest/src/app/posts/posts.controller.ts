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
import { User } from 'src/entities/user.entity';
import { Post as EPost } from 'src/entities/post.entity';
import { Filters, Queryable, QueryFilters } from 'src/lib/query-filters';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Auth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @AuthUser() user: User,
  ): Promise<EPost> {
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @Queryable({
    relations: ['author'],
  })
  findAll(@QueryFilters() filters: Filters) {
    return this.postsService.findAll(filters);
  }

  @Get(':id')
  @Queryable({
    relations: ['author', 'comments'],
    pagination: false,
  })
  findOne(@Param('id') id: Uuid, @QueryFilters() filters: Filters) {
    return this.postsService.findOne(id, filters);
  }

  @Patch(':id')
  update(
    @Param('id') id: Uuid,
    @Body() updatePostDto: UpdatePostDto,
    @AuthUser() user: User,
  ): Promise<EPost> {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Uuid, @AuthUser() user: User): Promise<void> {
    return this.postsService.remove(id, user);
  }
}
