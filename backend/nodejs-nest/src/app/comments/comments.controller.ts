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
  UseGuards,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { CreateCommentAnswerDto } from './dto/create-comment-answer.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@UseGuards(JwtAuthGuard)
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
  findAll(@AuthUser() user: User) {
    return this.commentsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: Uuid, @AuthUser() user: User) {
    return this.commentsService.findOne(id, user);
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
