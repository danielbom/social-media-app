import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joi from 'joi';
import { Role } from '../entities/role.enum';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class UpdateUserDto {
  @JoiSchema(Joi.string().optional())
  username?: string;

  @JoiSchema(Joi.string().optional())
  password?: string;

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(Role))
      .optional(),
  )
  role?: Role;
}
