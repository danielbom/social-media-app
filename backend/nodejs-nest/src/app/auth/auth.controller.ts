import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'src/entities/user.entity';

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

  @Auth()
  @Get('/me')
  me(@AuthUser() user: User): User {
    return user;
  }
}
