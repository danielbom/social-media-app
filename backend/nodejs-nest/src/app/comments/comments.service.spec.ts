import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TestUnreachableException } from 'src/tests/test-unreachable.exception';
import { MockRepository } from 'src/tests/mock-repository';
import { MockService } from 'src/tests/mock-service';

import { Post } from '../posts/entities/post.entity';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

describe('CommentsService', () => {
  let service: CommentsService;
  const commentRepository = MockRepository.create();
  const postsService = MockService.create<PostsService>(PostsService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        PostsService,
        { provide: getRepositoryToken(Comment), useValue: commentRepository },
        { provide: getRepositoryToken(Post), useValue: {} },
      ],
    })
      .overrideProvider(PostsService)
      .useValue(postsService)
      .compile();

    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('CommentsService.create', () => {
    it('should works', async () => {
      const author = { id: 'user-id' } as User;
      const postParent = { id: 'post-id' } as Post;
      const postComment = { postId: '', content: '' };
      postsService.getPostOrThrow.mockResolvedValueOnce(postParent);
      commentRepository.create.mockReturnValueOnce(postComment);
      const comment = await service.create(postComment, author);
      expect(comment).toBe(postComment);
      expect(commentRepository.create).toBeCalledTimes(1);
      expect(commentRepository.create).toBeCalledWith({
        content: postComment.content,
        postParent,
        author,
        likes: 0,
      } as Comment);
      expect(commentRepository.save).toBeCalledTimes(1);
    });
  });

  describe('CommentsService.createAnswer', () => {
    it('should works', async () => {
      const author = { id: 'user-id' } as User;
      const commentParent = { id: 'post-id', postParent: {} } as Comment;
      const postComment = { commentId: '', content: '' };
      commentRepository.findOne.mockResolvedValueOnce(commentParent);
      commentRepository.create.mockReturnValueOnce(postComment);
      const comment = await service.createAnswer(postComment, author);
      expect(comment).toBe(postComment);
      expect(commentRepository.create).toBeCalledTimes(1);
      expect(commentRepository.create).toBeCalledWith({
        content: postComment.content,
        author,
        commentParent,
        postParent: commentParent.postParent,
        likes: 0,
      });
      expect(commentRepository.save).toBeCalledTimes(1);
    });
  });

  describe('CommentsService.findOne', () => {
    it('should works if user was the author', async () => {
      const author = { id: 'user-id' } as User;
      const postId = 'post-id';
      commentRepository.findOne.mockImplementation(async () => ({ author }));
      await service.findOne(postId, author);
      expect(commentRepository.findOne).toBeCalledTimes(1);
    });

    it('should fail if post does not exists', async () => {
      try {
        const author = { id: 'user-1' } as User;
        commentRepository.findOne.mockImplementation(async () => null);
        await service.findOne('', author);
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should fail if user was not the author', async () => {
      try {
        const author = { id: 'user-1' } as User;
        const user = { id: 'user-2' } as User;
        commentRepository.findOne.mockImplementation(async () => ({ author }));
        await service.findOne('', user);
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('CommentsService.update', () => {
    it('should works', async () => {
      const author = { id: 'user-id' } as User;
      const newContent = 'content-2';
      const previousComment = { content: 'content-1', author } as Comment;
      service.findOne = jest
        .fn(service.findOne)
        .mockImplementationOnce(async () => previousComment);
      await service.update('', { content: newContent }, author);
      expect(commentRepository.save).toBeCalledTimes(1);
      expect(commentRepository.save).toBeCalledWith({
        content: newContent,
        author,
      } as Comment);
    });
  });

  describe('CommentsService.remove', () => {
    it('should works', async () => {
      const author = { id: 'user-id' } as User;
      const user = { id: 'user-id' } as User;
      const comment = { id: 'post-id', author } as Comment;
      service.findOne = jest
        .fn(service.findOne)
        .mockImplementationOnce(async () => comment);
      await service.remove('', user);
      expect(commentRepository.softDelete).toBeCalledTimes(1);
      expect(commentRepository.softDelete).toBeCalledWith({ id: comment.id });
    });
  });
});
