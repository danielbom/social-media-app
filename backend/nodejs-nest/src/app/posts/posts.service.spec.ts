import { MethodNotAllowedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UnreachableException } from 'src/exceptions/unreachable.exception';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PostsService.remove', () => {
    it('should fail ever', async () => {
      try {
        await service.remove('');
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(MethodNotAllowedException);
      }
    });
  });
});
