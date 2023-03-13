import { ApiProperty } from '@nestjs/swagger'
import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'

@JoiSchemaOptions({ allowUnknown: false })
export class CreateCommentAnswerDto {
  @ApiProperty({ example: 'This is a comment answer', description: 'Content of the comment answer' })
  @JoiSchema(Joi.string().required())
  content!: string

  @ApiProperty({ example: 'comment-uuid', description: 'UUID of the comment to answer' })
  @JoiSchema(Joi.string().required())
  commentId!: Uuid
}
