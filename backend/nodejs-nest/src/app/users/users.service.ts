import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { UnreachableException } from 'src/exceptions/unreachable.exception'
import { Filters, Page } from 'src/lib/query-filters'
import { applyFilters, applyOptionalFilters1 } from 'src/lib/query-filters/typeorm'
import { HashService } from 'src/services/hash/hash.service'
import { descriptions } from 'src/shared/desctiption-messages'
import { FindOneOptions, Repository } from 'typeorm'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

export interface UserAuthDto {
  username: string
  password: string
}

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>, private hashService: HashService) {}

  async create({ username, password, role }: CreateUserDto): Promise<User> {
    await this.ensureUserNotExists({ where: { username } })

    const hash = await this.hashService.hash(password)
    const user = this.userRepository.create({
      username,
      password: hash,
      role,
    })

    await this.userRepository.save(user)
    return this.hidePassword(user)
  }

  async findAll(filters: Filters): Promise<Page<User>> {
    return applyFilters(filters, this.userRepository)
  }

  async findOne(id: Uuid, filters?: Filters): Promise<User> {
    return this.getUserOrThrow(applyOptionalFilters1({ where: { id } }, filters))
  }

  async update(id: Uuid, { username, password, role }: UpdateUserDto): Promise<User> {
    const user = await this.getUserOrThrow({ where: { id } })

    if (username) {
      user.username = username
    }
    if (password) {
      const hash = await this.hashService.hash(password)
      user.password = hash
    }
    if (role) {
      user.role = role
    }

    await this.userRepository.save(user)
    return this.hidePassword(user)
  }

  async remove(id: Uuid): Promise<void> {
    const user = await this.getUserOrThrow({ where: { id } })

    await this.userRepository.softDelete({ id: user.id })
  }

  async getAuthenticated({ username, password }: UserAuthDto): Promise<{ id: Uuid }> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'password'],
    })

    if (user === null) {
      throw new BadRequestException(descriptions.INVALID_CREDENTIALS)
    }

    if (!user.password) {
      throw new UnreachableException('user.password must exists in UsersService.getAuthenticated')
    }

    const isPasswordValid = await this.hashService.compare(password, user.password)
    if (!isPasswordValid) {
      throw new BadRequestException(descriptions.INVALID_CREDENTIALS)
    }

    return { id: user.id }
  }

  async ensureUserNotExists(options: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(options)

    if (user !== null) {
      throw new BadRequestException(descriptions.USER_ALREADY_EXISTS)
    }
  }

  async getUserOrThrow(options: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(options)

    if (user === null) {
      throw new BadRequestException(descriptions.USER_NOT_EXISTS)
    }

    return user
  }

  hidePassword(user: User): User {
    user.password = undefined
    return user
  }
}
