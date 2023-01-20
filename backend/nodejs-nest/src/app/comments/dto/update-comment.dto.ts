import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'
import Joi from 'joi'

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UpdateCommentDto {
  @JoiSchema(Joi.string().required())
  content: string
}
