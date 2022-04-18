import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/app/users/users.service';
import { env } from 'src/environment';

export interface TokenPayload {
  sub: string;
}

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

    if (typeof userId !== 'string') {
      throw new UnauthorizedException();
    }

    try {
      return await this.usersService.findOne(userId);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
