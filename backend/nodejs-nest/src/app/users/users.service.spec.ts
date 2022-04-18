import { MethodNotAllowedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PostsService.remove', () => {
    it('should fail ever', async () => {
      try {
        await service.remove('');
        throw new Error('unreachable');
      } catch (error) {
        expect(error).toBeInstanceOf(MethodNotAllowedException);
      }
    });
  });
});
