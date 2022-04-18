import { BadRequestException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UnreachableException } from 'src/exceptions/unreachable.exception';
import { PasswordJwtStrategy } from 'src/strategies/passport-jwt.strategy';
import { MockService } from 'src/tests/mock-service';

import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const usersService = MockService.create<UsersService>(UsersService);
  const jwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [AuthService, UsersService, PasswordJwtStrategy],
    })
      .overrideProvider(JwtService)
      .useValue(jwtService)
      .overrideProvider(UsersService)
      .useValue(usersService)
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
    it('should works on valid data', async () => {
      const token = 'some-token';
      const body = {
        username: 'some-user',
        password: 'some-pass',
      };
      const user = { id: 'user-id', ...body };

      jwtService.signAsync.mockImplementationOnce(() => token);
      usersService.getAuthenticated.mockImplementationOnce(async () => user);
      const result = await controller.login(body);

      expect(jwtService.signAsync).toBeCalledTimes(1);
      expect(jwtService.signAsync).toBeCalledWith({ sub: user.id });
      expect(result).toStrictEqual({ token });
    });
  });
});
