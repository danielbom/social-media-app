import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { CreateCommentAnswerDto } from './dto/create-comment-answer.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    return {} as any;
  }

  async createAnswer(
    createCommentAnswerDto: CreateCommentAnswerDto,
  ): Promise<Comment> {
    return {} as any;
  }

  async findAll(): Promise<Comment[]> {
    return [];
  }

  async findOne(id: Uuid): Promise<Comment> {
    return {} as any;
  }

  async update(id: Uuid, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return {} as any;
  }

  async remove(id: Uuid): Promise<void> {
    throw new MethodNotAllowedException();
  }
}
