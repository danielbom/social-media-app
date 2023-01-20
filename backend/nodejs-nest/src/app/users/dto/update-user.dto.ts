import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'
import { Role } from 'src/entities/role.enum'

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UpdateUserDto {
  @JoiSchema(Joi.string().optional())
  username?: string

  @JoiSchema(Joi.string().optional())
  password?: string

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(Role))
      .optional(),
  )
  role?: Role
}
