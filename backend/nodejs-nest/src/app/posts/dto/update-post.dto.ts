import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'
import Joi from 'joi'
import { ApiProperty } from '@nestjs/swagger'

@JoiSchemaOptions({ allowUnknown: false })
export class UpdatePostDto {
  @ApiProperty({ example: 'This is a post', description: 'Content of the post' })
  @JoiSchema(Joi.string().required())
  content!: string
}
