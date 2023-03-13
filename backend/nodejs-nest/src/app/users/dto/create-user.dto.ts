import { ApiProperty } from '@nestjs/swagger'
import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'
import { Role } from 'src/entities/role.enum'

@JoiSchemaOptions({ allowUnknown: false })
export class CreateUserDto {
  @ApiProperty({ example: 'nickname', description: 'Username/Login of the user' })
  @JoiSchema(Joi.string().required())
  username!: string

  @ApiProperty({ example: 'strong-password', description: 'Password of the user' })
  @JoiSchema(Joi.string().required())
  password!: string

  @ApiProperty({ example: 'admin', description: 'Role of the user', enum: Object.values(Role) })
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(Role))
      .required(),
  )
  role!: Role
}
