import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from 'src/entities/role.enum';
import { User } from 'src/entities/user.entity';
import { TestUnreachableException } from 'src/tests/test-unreachable.exception';
import { HashService } from 'src/services/hash/hash.service';
import { MockRepository } from 'src/tests/mock-repository';
import { MockService } from 'src/tests/mock-service';

import { UserAuthDto, UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const userRepository = MockRepository.create();
  const hashService = MockService.create<HashService>(HashService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        HashService,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    })
      .overrideProvider(HashService)
      .useValue(hashService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('UsersService.create', () => {
    const userData = { username: '', password: '', role: Role.USER };

    it('should works if user does not exists', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValueOnce(userData);
      const user = await service.create(userData);
      expect(user).toBe(userData);
      expect(userRepository.findOne).toBeCalledTimes(1);
      expect(userRepository.create).toBeCalledTimes(1);
      expect(userRepository.save).toBeCalledTimes(1);
    });

    it('should not works if user exists', async () => {
      try {
        userRepository.findOne.mockResolvedValueOnce({} as any);
        await service.create(userData);
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(userRepository.create).not.toBeCalled();
      }
    });
  });

  describe('UsersService.update', () => {
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
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(userRepository.save).not.toBeCalled();
      }
    });
  });

  describe('UsersService.remove', () => {
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
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('UsersService.getAuthenticated', () => {
    it('should works', async () => {
      const user = { id: 'x', username: 'user', password: 'pass' } as User;
      const userAuth: UserAuthDto = {
        username: 'user-1',
        password: '123',
      };
      userRepository.findOne.mockResolvedValueOnce(user);
      hashService.compare.mockResolvedValueOnce(true);
      const auth = await service.getAuthenticated(userAuth);
      expect(auth).toStrictEqual({ id: user.id });
    });

    it('should fail if user does not exists', async () => {
      try {
        const userData: UserAuthDto = { username: 'user-1', password: '123' };
        userRepository.findOne.mockResolvedValueOnce(null);
        await service.getAuthenticated(userData);
        throw new TestUnreachableException();
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
        throw new TestUnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
