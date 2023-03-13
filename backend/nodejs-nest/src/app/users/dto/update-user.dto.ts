import { ApiProperty } from '@nestjs/swagger'
import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'
import { Role } from 'src/entities/role.enum'

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UpdateUserDto {
  @ApiProperty({ example: 'nickname', description: 'Username/Login of the user' })
  @JoiSchema(Joi.string().optional())
  username?: string

  @ApiProperty({ example: 'strong-password', description: 'Password of the user' })
  @JoiSchema(Joi.string().optional())
  password?: string

  @ApiProperty({ example: 'admin', description: 'Role of the user', enum: Object.values(Role) })
  @JoiSchema(
    Joi.string()
      .valid(...Object.values(Role))
      .optional(),
  )
  role?: Role
}
