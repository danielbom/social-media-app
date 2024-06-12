import { UnauthorizedException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Comment } from 'src/entities/comment.entity'
import { Post } from 'src/entities/post.entity'
import { Role } from 'src/entities/role.enum'
import { User } from 'src/entities/user.entity'
import { HashService } from 'src/services/hash/hash.service'

import { Repository, IsNull, Not } from 'typeorm'

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private hashService: HashService,
  ) {}

  async tearUp() {
    const maybeTester = await this.userRepository.findOne({ where: { username: 'tester' } })
    if (maybeTester) {
      return
    }

    const tester = this.userRepository.create({
      username: 'tester',
      password: await this.hashService.hash('test1234'),
      role: Role.USER,
    })
    await this.userRepository.save(tester)
  }

  async tearDown(user: User) {
    this.checkUser(user)
    await this.commentRepository.delete({ authorId: user.id, commentParentId: Not(IsNull()) })
    await this.commentRepository.delete({ authorId: user.id })
    await this.postRepository.delete({ authorId: user.id })
    await this.userRepository.delete({ id: user.id })
  }

  private checkUser(user: User) {
    if (user.username !== 'tester') {
      throw new UnauthorizedException('You are not authorized to perform this action')
    }
  }
}
