import { ApiProperty } from '@nestjs/swagger'
import { Comment } from 'src/entities/comment.entity'
import { BaseEntity } from 'typeorm'

export type CommentBase = Omit<Comment, keyof BaseEntity | 'author' | 'postParent' | 'commentParent' | 'commentAnswers'>

export class CommentResponse implements CommentBase {
  @ApiProperty({ example: 'uuid', description: 'Comment identifier' })
  id!: Uuid

  @ApiProperty({ example: 'content', description: 'Content of the comment' })
  content!: string

  @ApiProperty({ example: 99, description: 'Number of likes' })
  likes!: number

  @ApiProperty({ example: 'uuid', description: 'User author identifier' })
  authorId!: Uuid

  @ApiProperty({ example: 'uuid', description: 'Post parent identifier' })
  postParentId!: Uuid

  @ApiProperty({ example: 'uuid', description: 'Comment parent identifier' })
  commentParentId!: Uuid | null

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date of creation' })
  createdAt!: Date

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date of last update' })
  updatedAt!: Date

  @ApiProperty({ example: '2021-01-01T00:00:00.000Z', description: 'Date of deletion' })
  deletedAt!: Date | null
}
