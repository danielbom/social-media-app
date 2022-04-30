import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { env } from 'src/environment';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PasswordJwtStrategy } from './strategies/passport-jwt.strategy';

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
