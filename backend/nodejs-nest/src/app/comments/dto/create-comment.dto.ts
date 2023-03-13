import { ApiProperty } from '@nestjs/swagger'
import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'

@JoiSchemaOptions({ allowUnknown: false })
export class CreateCommentDto {
  @ApiProperty({ example: 'This is a comment', description: 'Content of the comment' })
  @JoiSchema(Joi.string().required())
  content!: string

  @ApiProperty({ example: 'post-uuid', description: 'UUID of the post to comment' })
  @JoiSchema(Joi.string().required())
  postId!: Uuid
}
