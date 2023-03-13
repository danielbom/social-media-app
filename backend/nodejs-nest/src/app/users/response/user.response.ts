import { ApiProperty } from '@nestjs/swagger'
import { Role } from 'src/entities/role.enum'
import { User } from 'src/entities/user.entity'
import { BaseEntity } from 'typeorm'

export type UserBase = Omit<User, keyof BaseEntity | 'posts' | 'comments'>

export class UserResponse implements UserBase {
  @ApiProperty({ example: 'uuid', description: 'User identifier' })
  id!: Uuid

  @ApiProperty({ example: 'nickname', description: 'Username/Login of the user' })
  username!: string

  @ApiProperty({ example: 'admin', description: 'Role of the user', enum: Object.values(Role) })
  role!: Role

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date of creation' })
  createdAt!: Date

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date of last update' })
  updatedAt!: Date

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date of deletion' })
  deletedAt!: Date | null
}
