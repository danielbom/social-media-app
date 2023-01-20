import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { UnreachableException } from 'src/exceptions/unreachable.exception'
import { HashService } from 'src/services/hash/hash.service'
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

  async findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  async findOne(id: Uuid): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } })
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
      throw new BadRequestException('User and/or password was invalid!')
    }

    if (!user.password) {
      throw new UnreachableException('user.password must exists in UsersService.getAuthenticated')
    }

    const isPasswordValid = await this.hashService.compare(password, user.password)
    if (!isPasswordValid) {
      throw new BadRequestException('User and/or password was invalid!')
    }

    return { id: user.id }
  }

  async ensureUserNotExists(options: FindOneOptions<User>) {
    const user = await this.userRepository.findOne(options)

    if (user !== null) {
      throw new BadRequestException('User already exists!')
    }
  }

  async getUserOrThrow(options: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(options)

    if (user === null) {
      throw new BadRequestException('User not exists!')
    }

    return user
  }

  hidePassword(user: User): User {
    user.password = undefined
    return user
  }
}
