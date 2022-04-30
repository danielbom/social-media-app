import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import Joi from 'joi';
import { Role } from '../entities/role.enum';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateUserDto {
  @JoiSchema(Joi.string().required())
  username: string;

  @JoiSchema(Joi.string().required())
  password: string;

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(Role))
      .required(),
  )
  role: Role;
}
