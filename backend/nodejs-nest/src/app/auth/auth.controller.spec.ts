import { BadRequestException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnreachableException } from 'src/exceptions/unreachable.exception';
import { PasswordJwtStrategy } from 'src/strategies/passport-jwt.strategy';
import { MockRepository } from 'src/tests/mock-repository';

import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const userRepository = MockRepository.create();
  const jwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [
        AuthService,
        PasswordJwtStrategy,
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    })
      .overrideProvider(JwtService)
      .useValue(jwtService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('AuthController.login', () => {
    it('should fail on invalid data', async () => {
      try {
        await controller.login({
          username: '',
          password: '',
        });
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('User and/or password was invalid!');
      }
    });

    it('should works on valid data', async () => {
      const token = 'some-token';
      const body = {
        username: 'some-user',
        password: 'some-pass',
      };

      jwtService.signAsync.mockImplementationOnce(() => token);
      userRepository.findOne.mockImplementationOnce(async () => body);
      const result = await controller.login(body);

      expect(result).toStrictEqual({ token });
    });
  });

  describe('AuthController.register', () => {
    it('should fail for duplicate username stored', async () => {
      try {
        const userExists = {};
        userRepository.findOne.mockImplementationOnce(async () => userExists);

        await controller.register({
          username: 'admin',
          password: '',
        });
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should works for valid data', async () => {
      const user = {};
      userRepository.create.mockImplementationOnce(() => user);
      userRepository.findOne.mockImplementationOnce(() => null);
      const newUser = await controller.register({
        username: 'user1',
        password: '123',
      });

      expect(newUser).toBe(user);
    });
  });
});
