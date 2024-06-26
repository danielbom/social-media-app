import { describe, it, test, beforeEach, expect, vi } from 'vitest'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Role } from 'src/entities/role.enum'
import { User } from 'src/entities/user.entity'
import { MockService } from 'src/tests/mock-service'

import { UsersService } from '../users/users.service'
import { AuthService } from './auth.service'
import { PasswordJwtStrategy } from './strategies/passport-jwt.strategy'

describe('AuthService', () => {
  let service: AuthService
  const usersService = MockService.create<UsersService>(UsersService)
  const jwtService = {
    signAsync: vi.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({})],
      providers: [AuthService, UsersService, PasswordJwtStrategy, { provide: getRepositoryToken(User), useValue: {} }],
    })
      .overrideProvider(PasswordJwtStrategy)
      .useValue({})
      .overrideProvider(JwtService)
      .useValue(jwtService)
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  test('AuthService.login should works', async () => {
    const access_token = 'some-token'
    const body = {
      username: 'some-user',
      password: 'some-pass',
    }
    const user = { id: 'user-id', ...body }

    jwtService.signAsync.mockImplementationOnce(() => access_token)
    usersService.getAuthenticated.mockImplementationOnce(async () => user)
    const result = await service.login(body)

    expect(jwtService.signAsync).toBeCalledTimes(1)
    expect(jwtService.signAsync).toBeCalledWith({ sub: user.id })
    expect(result).toStrictEqual({ access_token })
  })

  test('AuthService.register should only call UsersService.create', async () => {
    const arg = { password: '', username: '' }
    await service.register(arg)
    expect(usersService.create).toBeCalledTimes(1)
    expect(usersService.create).toBeCalledWith({ ...arg, role: Role.USER })
  })
})
