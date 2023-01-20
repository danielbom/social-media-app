import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'
import { Role } from 'src/entities/role.enum'

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateUserDto {
  @JoiSchema(Joi.string().required())
  username: string

  @JoiSchema(Joi.string().required())
  password: string

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(Role))
      .required(),
  )
  role: Role
}
