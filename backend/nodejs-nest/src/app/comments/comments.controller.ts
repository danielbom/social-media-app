import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import { AuthUser } from 'src/decorators/auth-user.decorator'
import { Auth } from 'src/decorators/auth.decorator'
import { Comment } from 'src/entities/comment.entity'
import { User } from 'src/entities/user.entity'
import { Filters, Queryable, QueryFilters } from 'src/lib/query-filters'

import { CommentsService } from './comments.service'
import { CreateCommentAnswerDto } from './dto/create-comment-answer.dto'
import { CreateCommentDto } from './dto/create-comment.dto'
import { UpdateCommentDto } from './dto/update-comment.dto'
import { CommentRelatedResponse } from './response/comment-related.response'
import { CommentResponse } from './response/comment.response'
import { CommentsPageResponse } from './response/comments-page.response'

@ApiTags('Comments')
@ApiBearerAuth()
@Auth()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiCreatedResponse({ type: CommentResponse })
  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @AuthUser() user: User): Promise<Comment> {
    return this.commentsService.create(createCommentDto, user)
  }

  @ApiCreatedResponse({ type: CommentResponse })
  @Post('/answers')
  createAnswer(@Body() createCommentAnswerDto: CreateCommentAnswerDto, @AuthUser() user: User): Promise<Comment> {
    return this.commentsService.createAnswer(createCommentAnswerDto, user)
  }

  @ApiOkResponse({ type: CommentsPageResponse, isArray: true })
  @Get()
  @Queryable({
    relations: ['author', 'commentAnswers', 'commentAnswers.author'],
  })
  findAll(@AuthUser() user: User, @QueryFilters() filters: Filters) {
    return this.commentsService.findAll(user, filters)
  }

  @ApiOkResponse({ type: CommentRelatedResponse })
  @ApiForbiddenResponse({ description: 'You are not the author of this comment!' })
  @Get(':id')
  @Queryable({
    pagination: false,
    relations: ['author', 'commentAnswers', 'commentAnswers.author'],
  })
  findOne(@Param('id') id: Uuid, @AuthUser() user: User, @QueryFilters() filters: Filters) {
    return this.commentsService.findOne(id, user, filters)
  }

  @ApiOkResponse({ type: CommentResponse })
  @ApiBadRequestResponse({ description: 'Comment not exists!' })
  @ApiForbiddenResponse({ description: 'You are not the author of this comment!' })
  @Patch(':id')
  update(@Param('id') id: Uuid, @Body() updateCommentDto: UpdateCommentDto, @AuthUser() user: User): Promise<Comment> {
    return this.commentsService.update(id, updateCommentDto, user)
  }

  @ApiBadRequestResponse({ description: 'Comment not exists!' })
  @ApiForbiddenResponse({ description: 'You are not the author of this comment!' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Uuid, @AuthUser() user: User): Promise<void> {
    return this.commentsService.remove(id, user)
  }
}
