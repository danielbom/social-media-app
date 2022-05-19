import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/app/users/users.service';
import { env } from 'src/environment';

import { TokenPayload } from '../types/token-payload';

// https://stackoverflow.com/questions/7905929/how-to-test-valid-uuid-guid
const REGEX_UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

    if (REGEX_UUID.test(userId)) {
      return await this.usersService.findOne(userId);
    } else {
      this.logger.error('TokenPayload.sub is an invalid uuid');
      throw new InternalServerErrorException();
    }
  }
}
