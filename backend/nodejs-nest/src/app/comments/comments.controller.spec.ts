import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockService } from 'src/tests/mock-service';

import { Post } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

describe('CommentsController', () => {
  let controller: CommentsController;
  const service = MockService.create<CommentsService>(CommentsService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        CommentsService,
        PostsService,
        { provide: getRepositoryToken(Comment), useValue: {} },
        { provide: getRepositoryToken(Post), useValue: {} },
      ],
    })
      .overrideProvider(CommentsService)
      .useValue(service)
      .compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('CommentsController.create should only call CommentsService.create', async () => {
    const args = [0 as any, 1 as any] as const;
    await controller.create(...args);
    expect(service.create).toBeCalledTimes(1);
    expect(service.create).toBeCalledWith(...args);
  });

  it('CommentsController.createAnswer should only call CommentsService.createAnswer', async () => {
    const args = [0 as any, 1 as any] as const;
    await controller.createAnswer(...args);
    expect(service.createAnswer).toBeCalledTimes(1);
    expect(service.createAnswer).toBeCalledWith(...args);
  });

  it('CommentsController.findAll should only call CommentsService.findAll', async () => {
    const args = [0 as any] as const;
    await controller.findAll(...args);
    expect(service.findAll).toBeCalledTimes(1);
    expect(service.findAll).toBeCalledWith(...args);
  });

  it('CommentsController.findOne should only call CommentsService.findOne', async () => {
    const args = [0 as any, 1 as any] as const;
    await controller.findOne(...args);
    expect(service.findOne).toBeCalledTimes(1);
    expect(service.findOne).toBeCalledWith(...args);
  });

  it('CommentsController.remove should only call CommentsService.remove', async () => {
    const args = [0 as any, 1 as any] as const;
    await controller.remove(...args);
    expect(service.remove).toBeCalledTimes(1);
    expect(service.remove).toBeCalledWith(...args);
  });

  it('CommentsController.update should only call CommentsService.update', async () => {
    const args = [0 as any, 1 as any, 2 as any] as const;
    await controller.update(...args);
    expect(service.update).toBeCalledTimes(1);
    expect(service.update).toBeCalledWith(...args);
  });
});
