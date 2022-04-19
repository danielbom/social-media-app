import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
import { CreateCommentAnswerDto } from './dto/create-comment-answer.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private postsService: PostsService,
  ) {}

  async create(
    { content, postId }: CreateCommentDto,
    author: User,
  ): Promise<Comment> {
    const postParent = await this.postsService.getPostOrThrow({
      id: postId,
    });
    const comment = this.commentsRepository.create({
      content,
      postParent,
      author,
    });

    await this.commentsRepository.save(comment);

    return comment;
  }

  async createAnswer(
    { commentId, content }: CreateCommentAnswerDto,
    author: User,
  ): Promise<Comment> {
    const commentParent = await this.getCommentOrThrow({ id: commentId });
    const comment = this.commentsRepository.create({
      content,
      author,
      commentParent,
      postParent: commentParent.postParent,
    });
    await this.commentsRepository.save(comment);
    return comment;
  }

  async findAll(author: User): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { author },
    });
  }

  async findOne(id: Uuid, user: User): Promise<Comment> {
    const comment = await this.getCommentOrThrow({ id });
    this.ensureCommentAuthor(comment, user);
    return comment;
  }

  async update(
    id: Uuid,
    { content }: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const comment = await this.findOne(id, user);
    comment.content = content;
    await this.commentsRepository.save(comment);
    return comment;
  }

  async remove(id: Uuid, user: User): Promise<void> {
    const comment = await this.findOne(id, user);
    await this.commentsRepository.softDelete({ id: comment.id });
  }

  async getCommentOrThrow(where: Partial<Comment>): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where,
      relations: ['author'],
    });

    if (comment === null) {
      throw new BadRequestException('Comment not exists!');
    }

    return comment;
  }

  ensureCommentAuthor(comment: Comment, user: User): void {
    if (comment.author.id !== user.id) {
      throw new ForbiddenException();
    }
  }
}
