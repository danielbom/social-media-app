import { ApiProperty } from '@nestjs/swagger'
import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'

@JoiSchemaOptions({ allowUnknown: false })
export class AuthLoginDto {
  @ApiProperty({ example: 'nickname', description: 'Username/Login of the user' })
  @JoiSchema(Joi.string().min(3).max(30).required())
  username!: string

  @ApiProperty({ example: 'strong-password', description: 'Password of the user' })
  @JoiSchema(Joi.string().min(8).max(30).required())
  password!: string
}
