import { MethodNotAllowedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnreachableException } from 'src/exceptions/unreachable.exception';
import { Post } from '../posts/entities/post.entity';
import { PostsModule } from '../posts/posts.module';
import { PostsService } from '../posts/posts.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
        PostsService,
        { provide: getRepositoryToken(Comment), useValue: {} },
        { provide: getRepositoryToken(Post), useValue: {} },
      ],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
