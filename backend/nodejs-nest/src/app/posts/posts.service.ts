import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  applyFilters,
  applyFiltersOptionsOne1,
  Filters,
  Page,
} from 'src/lib/query-filters';
import { FindOneOptions, Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create({ content }: CreatePostDto, author: User): Promise<Post> {
    const post = this.postRepository.create({
      content,
      author,
      likes: 0,
    });

    await this.postRepository.save(post);

    return post;
  }

  async findAll(filters: Filters): Promise<Page<Post>> {
    return applyFilters(filters, this.postRepository, {
      where: { authorId: filters.queries.authorId },
    });
  }

  async findOne(id: Uuid, filters?: Filters): Promise<Post | null> {
    return this.postRepository.findOne(
      applyFiltersOptionsOne1({ where: { id } }, filters),
    );
  }

  async findOneForUser(id: Uuid, user: User, filters?: Filters): Promise<Post> {
    const post = await this.getPostOrThrow(
      applyFiltersOptionsOne1({ where: { id } }, filters),
    );
    this.ensurePostAuthor(post, user);
    return post;
  }

  async update(
    id: Uuid,
    { content }: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.findOneForUser(id, user);
    post.content = content;
    await this.postRepository.save(post);
    return post;
  }

  async remove(id: Uuid, user: User): Promise<void> {
    const post = await this.findOneForUser(id, user);
    await this.postRepository.softDelete({ id: post.id });
  }

  async getPostOrThrow(options: FindOneOptions<Post>): Promise<Post> {
    const post = await this.postRepository.findOne(options);

    if (post === null) {
      throw new BadRequestException('Post not exists!');
    }

    return post;
  }

  ensurePostAuthor(post: Post, user: User): void {
    if (post.author.id !== user.id) {
      throw new ForbiddenException();
    }
  }
}
