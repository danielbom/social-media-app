import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { AuthUser } from 'src/decorators/auth-user.decorator'
import { Auth } from 'src/decorators/auth.decorator'
import { User } from 'src/entities/user.entity'
import { descriptions } from 'src/shared/descriptions-messages'

import { UserResponse } from '../users/response/user.response'
import { AuthService } from './auth.service'
import { AuthLoginDto } from './dto/auth-login.dto'
import { AuthRegisterDto } from './dto/auth-register.dto'
import { AuthLoginResponse } from './response/auth-login.response'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Validate the user credentials to provide a authentication access to other resources' })
  @ApiOkResponse({ type: AuthLoginResponse })
  @ApiBadRequestResponse({ description: descriptions.INVALID_CREDENTIALS })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() authLoginDto: AuthLoginDto): Promise<AuthLoginResponse> {
    return this.authService.login(authLoginDto)
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ type: UserResponse })
  @ApiBadRequestResponse({ description: descriptions.USER_ALREADY_EXISTS })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() authRegisterDto: AuthRegisterDto): Promise<User> {
    return this.authService.register(authRegisterDto)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user' })
  @ApiOkResponse({ type: UserResponse })
  @ApiBadRequestResponse({ description: descriptions.USER_NOT_EXISTS })
  @Auth()
  @Get('/me')
  me(@AuthUser() user: User): User {
    return user
  }
}
