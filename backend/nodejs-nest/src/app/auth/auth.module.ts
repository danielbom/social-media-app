import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { env } from 'src/environment';
import { PasswordJwtStrategy } from 'src/strategies/passport-jwt.strategy';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: env.jwt.secret,
      signOptions: {
        expiresIn: env.jwt.expiresIn,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordJwtStrategy],
})
export class AuthModule {}
