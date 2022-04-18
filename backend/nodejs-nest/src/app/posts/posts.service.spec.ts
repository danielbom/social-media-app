import { ForbiddenException, MethodNotAllowedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnreachableException } from 'src/exceptions/unreachable.exception';
import { MockRepository } from 'src/tests/mock-repository';
import { User } from '../users/entities/user.entity';
import { Post } from './entities/post.entity';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;
  const postRepository = MockRepository.create();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: postRepository },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PostsService.remove', () => {
    it('should works if user was the author', async () => {
      const author = { id: 'user-id' } as User;
      const user = { id: 'user-id' } as User;
      const post = { id: 'post-id', author };
      postRepository.findOne.mockImplementationOnce(async () => post);
      await service.remove('', user);
      expect(postRepository.softDelete).toBeCalledTimes(1);
      expect(postRepository.softDelete).toBeCalledWith({ id: post.id });
    });

    it('should fail if user was not the author', async () => {
      try {
        const author = { id: 'author-id' } as User;
        const user = { id: 'user-id' } as User;
        const post = { id: 'post-id', author };
        postRepository.findOne.mockImplementationOnce(async () => post);
        await service.remove('', user);
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
