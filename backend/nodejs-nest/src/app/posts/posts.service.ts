import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Post } from 'src/entities/post.entity'
import { User } from 'src/entities/user.entity'
import { applyFilters, applyFiltersOptionsOne1, Filters, Page } from 'src/lib/query-filters'
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

  async findOne(id: Uuid, filters?: Filters): Promise<Post | null> {
    return this.postRepository.findOne(applyFiltersOptionsOne1({ where: { id } }, filters))
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
      throw new BadRequestException('Post not exists!')
    }

    return post
  }

  ensurePostAuthor(post: Post, user: User): void {
    if (post.authorId !== user.id) {
      throw new ForbiddenException()
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
