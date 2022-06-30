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
      where: { id: postId },
    });
    const comment = this.commentsRepository.create({
      content,
      postParent,
      author,
      likes: 0,
    });

    await this.commentsRepository.save(comment);

    return comment;
  }

  async createAnswer(
    { commentId, content }: CreateCommentAnswerDto,
    author: User,
  ): Promise<Comment> {
    const commentParent = await this.getCommentOrThrow({
      where: { id: commentId },
    });
    const comment = this.commentsRepository.create({
      content,
      author,
      commentParent,
      postParent: commentParent.postParent,
      likes: 0,
    });
    await this.commentsRepository.save(comment);
    return comment;
  }

  async findAll(author: User, filters: Filters): Promise<Page<Comment>> {
    return applyFilters(filters, this.commentsRepository, {
      where: { authorId: author.id },
    });
  }

  async findOne(id: Uuid, user: User, filters?: Filters): Promise<Comment> {
    const comment = await this.getCommentOrThrow(
      applyFiltersOptionsOne1({ where: { id } }, filters),
    );
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

  async getCommentOrThrow(options: FindOneOptions<Comment>): Promise<Comment> {
    const comment = await this.commentsRepository.findOne(options);

    if (comment === null) {
      throw new BadRequestException('Comment not exists!');
    }

    return comment;
  }

  ensureCommentAuthor(comment: Comment, user: User): void {
    if (comment.authorId !== user.id) {
      throw new ForbiddenException();
    }
  }
}
