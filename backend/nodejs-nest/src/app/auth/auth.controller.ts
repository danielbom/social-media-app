import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from '../users/entities/user.entity';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginResponse } from './response/auth-login.response';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authLoginDto: AuthLoginDto): Promise<AuthLoginResponse> {
    return this.authService.login(authLoginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() authRegisterDto: AuthRegisterDto): Promise<User> {
    return this.authService.register(authRegisterDto);
  }
}
