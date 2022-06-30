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
import { Filters, Queryable, QueryFilters } from 'src/lib/query-filters';

import { CommentsService } from './comments.service';
import { CreateCommentAnswerDto } from './dto/create-comment-answer.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Auth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @AuthUser() user: User) {
    return this.commentsService.create(createCommentDto, user);
  }

  @Post('/answers')
  createAnswer(
    @Body() createCommentAnswerDto: CreateCommentAnswerDto,
    @AuthUser() user: User,
  ) {
    return this.commentsService.createAnswer(createCommentAnswerDto, user);
  }

  @Get()
  @Queryable({
    relations: ['author', 'answers', 'answers.author'],
  })
  findAll(@AuthUser() user: User, @QueryFilters() filters: Filters) {
    return this.commentsService.findAll(user, filters);
  }

  @Get(':id')
  @Queryable({
    pagination: false,
    relations: ['author', 'answers', 'answers.author'],
  })
  findOne(
    @Param('id') id: Uuid,
    @AuthUser() user: User,
    @QueryFilters() filters: Filters,
  ) {
    return this.commentsService.findOne(id, user, filters);
  }

  @Patch(':id')
  update(
    @Param('id') id: Uuid,
    @Body() updateCommentDto: UpdateCommentDto,
    @AuthUser() user: User,
  ) {
    return this.commentsService.update(id, updateCommentDto, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Uuid, @AuthUser() user: User) {
    return this.commentsService.remove(id, user);
  }
}
