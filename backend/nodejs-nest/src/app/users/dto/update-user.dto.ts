import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UpdateUserDto {
  @JoiSchema(Joi.string().optional())
  username?: string;

  @JoiSchema(Joi.string().optional())
  password?: string;
}
