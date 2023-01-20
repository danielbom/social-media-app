import { describe, it, test, beforeEach, expect } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { MockService } from 'src/tests/mock-service'

import { UsersController } from './users.controller'
import { UsersService } from './users.service'

describe('UsersController', () => {
  let controller: UsersController
  const service = MockService.create<UsersService>(UsersService)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, { provide: getRepositoryToken(User), useValue: {} }],
    })
      .overrideProvider(UsersService)
      .useValue(service)
      .compile()

    controller = module.get<UsersController>(UsersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  test('UsersController.create should only call UsersService.create', async () => {
    const args = [0 as any] as const
    await controller.create(...args)
    expect(service.create).toBeCalledTimes(1)
    expect(service.create).toBeCalledWith(...args)
  })

  test('UsersController.findAll should only call UsersService.findAll', async () => {
    const args = [] as const
    await controller.findAll(...args)
    expect(service.findAll).toBeCalledTimes(1)
    expect(service.findAll).toBeCalledWith(...args)
  })

  test('UsersController.findOne should only call UsersService.findOne', async () => {
    const args = [0 as any] as const
    await controller.findOne(...args)
    expect(service.findOne).toBeCalledTimes(1)
    expect(service.findOne).toBeCalledWith(...args)
  })

  test('UsersController.remove should only call UsersService.remove', async () => {
    const args = [0 as any] as const
    await controller.remove(...args)
    expect(service.remove).toBeCalledTimes(1)
    expect(service.remove).toBeCalledWith(...args)
  })

  test('UsersController.update should only call UsersService.update', async () => {
    const args = [0 as any, 1 as any] as const
    await controller.update(...args)
    expect(service.update).toBeCalledTimes(1)
    expect(service.update).toBeCalledWith(...args)
  })
})
