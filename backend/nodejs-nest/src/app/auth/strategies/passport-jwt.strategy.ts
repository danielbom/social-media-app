import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/app/users/users.service';
import { env } from 'src/environment';
import Joi from 'joi';

export interface TokenPayload {
  sub: string;
}

const uuid = Joi.string().uuid();
const isUuid = (value: string) => !uuid.validate(value).error;

@Injectable()
export class PasswordJwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger('JWT');

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
      this.logger.error('TokenPayload.sub is an invalid uuid');
      throw new InternalServerErrorException();
    }
  }
}
