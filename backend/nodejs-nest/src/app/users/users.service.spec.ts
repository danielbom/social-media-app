import { BadRequestException, MethodNotAllowedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './entities/user.entity';
import { UserAuthDto, UsersService } from './users.service';

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('PostsService.create', () => {
    it('should works if user does not exists', async () => {
      const userData = { username: '', password: '' };
      userRepository.findOne.mockReturnValueOnce(null);
      userRepository.create.mockReturnValueOnce(userData);
      const user = await service.create(userData);
      expect(user).toBe(userData);
      expect(userRepository.findOne).toBeCalledTimes(1);
      expect(userRepository.create).toBeCalledTimes(1);
      expect(userRepository.save).toBeCalledTimes(1);
    });

    it('should not works if user exists', async () => {
      try {
        const userData = { username: '', password: '' };
        userRepository.findOne.mockResolvedValueOnce({} as any);
        await service.create(userData);
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(userRepository.create).not.toBeCalled();
      }
    });
  });

  describe('PostsService.update', () => {
    it('should works if user exists', async () => {
      const id = 'x';
      const newUsername = 'user-2';
      const previousUser = { username: 'user-1', password: 'pass' } as User;
      userRepository.findOne.mockImplementation(async () => previousUser);
      await service.update(id, { username: newUsername });
      expect(userRepository.save).toBeCalledTimes(1);
      expect(userRepository.save).toBeCalledWith({
        username: newUsername,
        password: previousUser.password,
      } as User);
    });

    it('should fail if user does not exists', async () => {
      try {
        userRepository.findOne.mockImplementation(async () => null);
        await service.update('', {});
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(userRepository.save).not.toBeCalled();
      }
    });
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

  describe('PostsService.getAuthenticated', () => {
    it('should works', async () => {
      const userData: UserAuthDto = { username: 'user-1', password: '123' };
      userRepository.findOne.mockResolvedValueOnce(userData);
      const user = await service.getAuthenticated(userData);
      expect(user).toBe(userData);
    });

    it('should fail if user does not exists', async () => {
      try {
        const userData: UserAuthDto = { username: 'user-1', password: '123' };
        userRepository.findOne.mockResolvedValueOnce(null);
        await service.getAuthenticated(userData);
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should fail if password does not not match', async () => {
      try {
        const correctPassword = '321';
        const userData: UserAuthDto = { username: 'user-1', password: '123' };
        userRepository.findOne.mockResolvedValueOnce({
          password: correctPassword,
        });
        await service.getAuthenticated(userData);
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
