import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { UnreachableException } from 'src/exceptions/unreachable.exception';
import { TestUnreachableException } from 'src/tests/test-unreachable.exception';
import { MockRepository } from 'src/tests/mock-repository';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PostsService.create', () => {
    it('should works', async () => {
      const author = { id: 'user-id' } as User;
      const postData = { content: '' };
      postRepository.create.mockReturnValueOnce(postData);
      const post = await service.create(postData, author);
      expect(post).toBe(postData);
      expect(postRepository.create).toBeCalledTimes(1);
      expect(postRepository.save).toBeCalledTimes(1);
    });
  });

  describe('PostsService.findOne', () => {
    it('should works if user was the author', async () => {
      const author = { id: 'user-id' } as User;
      const postId = 'post-id';
      postRepository.findOne.mockImplementation(async () => ({
        authorId: author.id,
      }));
      await service.findOneByAuthor(postId, author);
      expect(postRepository.findOne).toBeCalledTimes(1);
    });

    it('should fail if post does not exists', async () => {
      try {
        const author = { id: 'user-1' } as User;
        postRepository.findOne.mockImplementation(async () => null);
        await service.findOneByAuthor('', author);
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should fail if user was not the author', async () => {
      try {
        const author = { id: 'user-1' } as User;
        const user = { id: 'user-2' } as User;
        postRepository.findOne.mockImplementation(async () => ({ author }));
        await service.findOneByAuthor('', user);
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('PostsService.update', () => {
    it('should works', async () => {
      const author = { id: 'user-id' } as User;
      const newContent = 'content-2';
      const previousPost = { content: 'content-1', author } as Post;
      service.findOneByAuthor = jest
        .fn(service.findOneByAuthor)
        .mockImplementationOnce(async () => previousPost);
      await service.update('', { content: newContent }, author);
      expect(postRepository.save).toBeCalledTimes(1);
      expect(postRepository.save).toBeCalledWith({
        content: newContent,
        author,
      } as Post);
    });
  });

  describe('PostsService.remove', () => {
    it('should works', async () => {
      const author = { id: 'user-id' } as User;
      const user = { id: 'user-id' } as User;
      const post = { id: 'post-id', author } as Post;
      service.findOneByAuthor = jest
        .fn(service.findOneByAuthor)
        .mockImplementationOnce(async () => post);
      await service.remove('', user);
      expect(postRepository.softDelete).toBeCalledTimes(1);
      expect(postRepository.softDelete).toBeCalledWith({ id: post.id });
    });
  });
});
