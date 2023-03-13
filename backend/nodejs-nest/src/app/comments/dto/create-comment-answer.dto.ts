import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'
import Joi from 'joi'

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateCommentAnswerDto {
  @JoiSchema(Joi.string().required())
  content!: string

  @JoiSchema(Joi.string().required())
  commentId!: Uuid
}
