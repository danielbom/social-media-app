import { ApiProperty } from '@nestjs/swagger'
import Joi from 'joi'
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi'

@JoiSchemaOptions({ allowUnknown: false })
export class CreatePostDto {
  @ApiProperty({ example: 'This is a post', description: 'Content of the post' })
  @JoiSchema(Joi.string().required())
  content!: string
}
