import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/app/users/entities/user.entity';
import { env } from 'src/environment';
import { Repository } from 'typeorm';

@Injectable()
export class PasswordJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.jwt.secret,
    });
  }

  async validate(payload: any) {
    const userId: string = payload.sub;

    if (typeof userId !== 'string') {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (user === null) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
