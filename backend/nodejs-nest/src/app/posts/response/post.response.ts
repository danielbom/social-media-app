import { ApiProperty } from '@nestjs/swagger'
import { Post } from 'src/entities/post.entity'
import { BaseEntity } from 'typeorm'

export type PostBase = Omit<Post, keyof BaseEntity | 'author' | 'comments'>

export class PostResponse implements PostBase {
  @ApiProperty({ example: 'uuid', description: 'Post identifier' })
  id!: Uuid

  @ApiProperty({ example: 'content', description: 'Content of the comment' })
  content!: string

  @ApiProperty({ example: 99, description: 'Number of likes' })
  likes!: number

  @ApiProperty({ example: 'uuid', description: 'User author identifier' })
  authorId!: Uuid

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date of creation' })
  createdAt!: Date

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date of last update' })
  updatedAt!: Date

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date of deletion' })
  deletedAt!: Date | null
}
