import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PasswordJwtStrategy } from 'src/strategies/passport-jwt.strategy';
import { MockService } from 'src/tests/mock-service';

import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = MockService.create<UsersService>(UsersService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [
        AuthService,
        UsersService,
        PasswordJwtStrategy,
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
