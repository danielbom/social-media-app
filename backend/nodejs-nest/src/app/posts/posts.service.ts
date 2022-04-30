import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async findAll(author: User): Promise<Post[]> {
    return this.postRepository.find({ where: { author: { id: author.id } } });
  }

  async findOne(id: Uuid, user: User): Promise<Post> {
    const post = await this.getPostOrThrow({ id });
    this.ensurePostAuthor(post, user);
    return post;
  }

  async update(
    id: Uuid,
    { content }: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const post = await this.findOne(id, user);
    post.content = content;
    await this.postRepository.save(post);
    return post;
  }

  async remove(id: Uuid, user: User): Promise<void> {
    const post = await this.findOne(id, user);
    await this.postRepository.softDelete({ id: post.id });
  }

  async getPostOrThrow(where: Partial<Post>): Promise<Post> {
    const post = await this.postRepository.findOne({
      where,
      relations: ['author'],
    });

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
