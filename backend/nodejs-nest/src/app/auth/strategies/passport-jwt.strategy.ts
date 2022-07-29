import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/app/users/users.service';
import { env } from 'src/environment';
import Joi from 'joi';

import { TokenPayload } from '../types/token-payload';
import { UnreachableException } from 'src/exceptions/unreachable.exception';

const uuid = Joi.string().uuid();
const isUuid = (value: string) => !uuid.validate(value).error;

@Injectable()
export class PasswordJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.jwt.secret,
    });
  }

  async validate(payload: TokenPayload) {
    const userId = payload.sub;
    if (isUuid(userId)) {
      return await this.usersService.findOne(userId);
    } else {
      throw new UnreachableException('TokenPayload.sub is an invalid uuid');
    }
  }
}
