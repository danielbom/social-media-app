import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'
import Joi from 'joi'

@JoiSchemaOptions({
  allowUnknown: false,
})
export class AuthLoginDto {
  @JoiSchema(Joi.string().min(3).max(30).required())
  username: string

  @JoiSchema(Joi.string().min(8).max(30).required())
  password: string
}
