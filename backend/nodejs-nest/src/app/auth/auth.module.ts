import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/environment';
import { PasswordJwtStrategy } from 'src/strategies/passport-jwt.strategy';

@Module({
  imports: [
    PassportModule,
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
