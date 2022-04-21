import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockService } from 'src/tests/mock-service';

import { Post } from './entities/post.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  const service = MockService.create<PostsService>(PostsService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: {} },
      ],
    })
      .overrideProvider(PostsService)
      .useValue(service)
      .compile();

    controller = module.get<PostsController>(PostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('PostsController.create should only call PostsService.create', async () => {
    const args = [0 as any, 1 as any] as const;
    await controller.create(...args);
    expect(service.create).toBeCalledTimes(1);
    expect(service.create).toBeCalledWith(...args);
  });

  test('PostsController.findAll should only call PostsService.findAll', async () => {
    const args = [0 as any] as const;
    await controller.findAll(...args);
    expect(service.findAll).toBeCalledTimes(1);
    expect(service.findAll).toBeCalledWith(...args);
  });

  test('PostsController.findOne should only call PostsService.findOne', async () => {
    const args = [0 as any, 1 as any] as const;
    await controller.findOne(...args);
    expect(service.findOne).toBeCalledTimes(1);
    expect(service.findOne).toBeCalledWith(...args);
  });

  test('PostsController.remove should only call PostsService.remove', async () => {
    const args = [0 as any, 1 as any] as const;
    await controller.remove(...args);
    expect(service.remove).toBeCalledTimes(1);
    expect(service.remove).toBeCalledWith(...args);
  });

  test('PostsController.update should only call PostsService.update', async () => {
    const args = [0 as any, 1 as any, 2 as any] as const;
    await controller.update(...args);
    expect(service.update).toBeCalledTimes(1);
    expect(service.update).toBeCalledWith(...args);
  });
});
