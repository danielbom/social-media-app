import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateUserDto {
  @JoiSchema(Joi.string().required())
  username: string;

  @JoiSchema(Joi.string().required())
  password: string;
}
