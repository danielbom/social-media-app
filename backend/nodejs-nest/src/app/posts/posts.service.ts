import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from 'src/entities/post.entity'
import { User } from 'src/entities/user.entity'
import { Filters, Page } from 'src/lib/query-filters'
import { applyFilters, applyOptionalFilters1 } from 'src/lib/query-filters/typeorm'
import { descriptions } from 'src/shared/descriptions-messages'
import { FindOneOptions, Repository } from 'typeorm'

import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>) {}

  async create({ content }: CreatePostDto, author: User): Promise<Post> {
    const post = this.postRepository.create({
      content,
      author,
      likes: 0,
    })

    await this.postRepository.save(post)

    return post
  }

  async findAll(filters: Filters): Promise<Page<Post>> {
    return applyFilters(filters, this.postRepository, {
      where: { authorId: filters.queries.authorId },
    })
  }

  async findOne(id: Uuid, filters?: Filters): Promise<Post> {
    return this.getPostOrThrow(applyOptionalFilters1({ where: { id } }, filters))
  }

  async update(id: Uuid, { content }: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.findOneByAuthor(id, user)
    post.content = content
    await this.postRepository.save(post)
    return post
  }

  async remove(id: Uuid, user: User): Promise<void> {
    const post = await this.findOneByAuthor(id, user)
    await this.postRepository.softDelete({ id: post.id })
  }

  async getPostOrThrow(options: FindOneOptions<Post>): Promise<Post> {
    const post = await this.postRepository.findOne(options)

    if (post === null) {
      throw new BadRequestException(descriptions.POST_NOT_EXISTS)
    }

    return post
  }

  ensurePostAuthor(post: Post, user: User): void {
    if (post.authorId !== user.id) {
      throw new ForbiddenException(undefined, descriptions.IS_NOT_POST_AUTHOR)
    }
  }

  async findOneByAuthor(id: Uuid, author: User, options?: FindOneOptions<Post>): Promise<Post> {
    const post = await this.getPostOrThrow({
      ...options,
      where: { ...options?.where, id },
    })
    this.ensurePostAuthor(post, author)
    return post
  }
}
