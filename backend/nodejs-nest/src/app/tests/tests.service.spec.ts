import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { BadRequestException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Role } from 'src/entities/role.enum'
import { Comment } from 'src/entities/comment.entity'
import { User } from 'src/entities/user.entity'
import { Post } from 'src/entities/post.entity'
import { HashService } from 'src/services/hash/hash.service'
import { MockRepository } from 'src/tests/mock-repository'
import { MockService } from 'src/tests/mock-service'

import { TestsService } from './tests.service'

describe('TestsService', () => {
  let service: TestsService
  const commentRepository = MockRepository.create()
  const userRepository = MockRepository.create()
  const postRepository = MockRepository.create()
  const hashService = MockService.create<HashService>(HashService)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestsService,
        HashService,
        { provide: getRepositoryToken(User), useValue: userRepository },
        { provide: getRepositoryToken(Post), useValue: postRepository },
        { provide: getRepositoryToken(Comment), useValue: commentRepository },
      ],
    })
      .overrideProvider(HashService)
      .useValue(hashService)
      .compile()

    service = module.get<TestsService>(TestsService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('TestsService.tearUp', () => {
    const userData = { username: '', password: '', role: Role.USER }

    it('should works if user does not exists', async () => {
      userRepository.findOne.mockResolvedValue(null)
      userRepository.create.mockReturnValueOnce(userData)
      await service.tearUp()
      expect(userRepository.findOne).toBeCalledTimes(1)
      expect(userRepository.create).toBeCalledTimes(1)
      expect(userRepository.save).toBeCalledTimes(1)
      expect(hashService.hash).toBeCalledTimes(1)
    })

    it('should do nothing if user exists', async () => {
      userRepository.findOne.mockResolvedValueOnce({} as any)
      await service.tearUp()
      expect(userRepository.findOne).toBeCalledTimes(1)
      expect(userRepository.create).not.toBeCalled()
      expect(userRepository.save).not.toBeCalled()
    })
  })

  describe('TestsService.tearDown', () => {
    const user = { id: 'x', username: 'tester', password: '', role: Role.USER } as User

    it('should works if user exists', async () => {
      await service.tearDown(user)
      expect(commentRepository.delete).toBeCalledTimes(2)
      expect(postRepository.delete).toBeCalledTimes(1)
      expect(userRepository.delete).toBeCalledTimes(1)
    })
  })
})
