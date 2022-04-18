import { BadRequestException, MethodNotAllowedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

import { getRepositoryToken } from '@nestjs/typeorm';
import { MockRepository } from 'src/tests/mock-repository';
import { UnreachableException } from 'src/exceptions/unreachable.exception';

describe('UsersService', () => {
  let service: UsersService;
  const userRepository = MockRepository.create();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PostsService.remove', () => {
    it('should works if user exists', async () => {
      const id = 'x';
      userRepository.findOne.mockImplementation(async () => ({ id }));
      await service.remove(id);
      expect(userRepository.softDelete).toBeCalledTimes(1);
      expect(userRepository.softDelete).toBeCalledWith({ id });
    });

    it('should fail if user does not exists', async () => {
      try {
        userRepository.findOne.mockImplementation(async () => null);
        await service.remove('');
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
