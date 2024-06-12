import { describe, it, test, beforeEach, expect } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Comment } from 'src/entities/comment.entity'
import { User } from 'src/entities/user.entity'
import { Post } from 'src/entities/post.entity'
import { MockService } from 'src/tests/mock-service'

import { TestsController } from './tests.controller'
import { TestsService } from './tests.service'

describe('TestsController', () => {
  let controller: TestsController
  const service = MockService.create<TestsService>(TestsService)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestsController],
      providers: [
        TestsService,
        { provide: getRepositoryToken(Comment), useValue: {} },
        { provide: getRepositoryToken(User), useValue: {} },
        { provide: getRepositoryToken(Post), useValue: {} },
      ],
    })
      .overrideProvider(TestsService)
      .useValue(service)
      .compile()

    controller = module.get<TestsController>(TestsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  test('TestsController.tearUp should only call TestsService.tearUp', async () => {
    const args = [] as const
    await controller.tearUp(...args)
    expect(service.tearUp).toBeCalledTimes(1)
    expect(service.tearUp).toBeCalledWith(...args)
  })

  test('TestsController.tearDown should only call TestsService.tearDown', async () => {
    const args = [0 as any] as const
    await controller.tearDown(...args)
    expect(service.tearDown).toBeCalledTimes(1)
    expect(service.tearDown).toBeCalledWith(...args)
  })
})
