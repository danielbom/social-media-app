import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthUser } from 'src/decorators/auth-user.decorator'
import { Auth } from 'src/decorators/auth.decorator'
import { User } from 'src/entities/user.entity'
import { Filters, Queryable, QueryFilters } from 'src/lib/query-filters'

import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostsService } from './posts.service'
import { PostResponse } from './response/post.response'
import { PostsPageResponse } from './response/posts-page.response'
import { SinglePostResponse } from './response/single-post.response'

@ApiTags('Posts')
@ApiBearerAuth()
@Auth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiCreatedResponse({ type: PostResponse })
  @Post()
  create(@Body() createPostDto: CreatePostDto, @AuthUser() user: User): Promise<PostResponse> {
    return this.postsService.create(createPostDto, user)
  }

  @ApiOkResponse({ type: PostsPageResponse })
  @Get()
  @Queryable({
    relations: ['author'],
  })
  findAll(@QueryFilters() filters: Filters): Promise<PostsPageResponse> {
    return this.postsService.findAll(filters)
  }

  @ApiOkResponse({ type: SinglePostResponse })
  @ApiBadRequestResponse({ description: 'Post not exists!' })
  @Get(':id')
  @Queryable({
    relations: ['author', 'comments'],
    pagination: false,
  })
  findOne(@Param('id') id: Uuid, @QueryFilters() filters: Filters): Promise<SinglePostResponse> {
    return this.postsService.findOne(id, filters)
  }

  @ApiOkResponse({ type: PostResponse })
  @ApiBadRequestResponse({ description: 'Post not exists!' })
  @Patch(':id')
  update(@Param('id') id: Uuid, @Body() updatePostDto: UpdatePostDto, @AuthUser() user: User): Promise<PostResponse> {
    return this.postsService.update(id, updatePostDto, user)
  }

  @ApiBadRequestResponse({ description: 'Post not exists!' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Uuid, @AuthUser() user: User): Promise<void> {
    return this.postsService.remove(id, user)
  }
}
