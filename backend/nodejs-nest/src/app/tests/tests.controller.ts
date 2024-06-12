import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { AuthUser } from 'src/decorators/auth-user.decorator'
import { Auth } from 'src/decorators/auth.decorator'
import { User } from 'src/entities/user.entity'
import { TestsService } from './tests.service'

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post('/tear-up')
  async tearUp() {
    return await this.testsService.tearUp()
  }

  @Post('/tear-down')
  @Auth()
  async tearDown(@AuthUser() user: User) {
    return await this.testsService.tearDown(user)
  }
}
