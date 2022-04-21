import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { env } from 'src/environment';
import { PasswordJwtStrategy } from 'src/strategies/passport-jwt.strategy';
import { MockService } from 'src/tests/mock-service';

import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

env.jwt.secret = 'x';

describe('AuthController', () => {
  let controller: AuthController;
  const service = MockService.create<AuthService>(AuthService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      controllers: [AuthController],
      providers: [AuthService, UsersService, PasswordJwtStrategy],
    })
      .overrideProvider(JwtService)
      .useValue({})
      .overrideProvider(UsersService)
      .useValue({})
      .overrideProvider(AuthService)
      .useValue(service)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  test('CommentsController.login should only call CommentsService.login', async () => {
    const args = [0 as any] as const;
    await controller.login(...args);
    expect(service.login).toBeCalledTimes(1);
    expect(service.login).toBeCalledWith(...args);
  });

  test('CommentsController.register should only call CommentsService.register', async () => {
    const args = [0 as any] as const;
    await controller.register(...args);
    expect(service.register).toBeCalledTimes(1);
    expect(service.register).toBeCalledWith(...args);
  });
});
