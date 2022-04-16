import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
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
        throw new Error('unreachable');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('User and/or password was invalid!');
      }
    });

    it('should works on valid data', async () => {
      const result = await controller.login({
        username: 'admin',
        password: '123mudar',
      });

      expect(result).toStrictEqual({
        token: 'some-token',
      });
    });
  });

  describe('AuthController.register', () => {
    it('should fail for duplicate username stored', async () => {
      try {
        await controller.register({
          username: 'admin',
          password: '',
        });
        throw new Error('unreachable');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
    it('should works for valid data', async () => {
      const newUser = await controller.register({
        username: 'user1',
        password: '123',
      });

      expect(newUser).toBeDefined();
    });
  });
});
