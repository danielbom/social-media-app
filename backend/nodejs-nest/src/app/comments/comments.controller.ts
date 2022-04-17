import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentAnswerDto } from './dto/create-comment-answer.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @Post('/answers')
  createAnswer(@Body() createCommentAnswerDto: CreateCommentAnswerDto) {
    return this.commentsService.createAnswer(createCommentAnswerDto);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Uuid) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: Uuid, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Uuid) {
    return this.commentsService.remove(id);
  }
}
