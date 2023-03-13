import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from 'src/decorators/auth.decorator'
import { Role } from 'src/entities/role.enum'
import { Filters, Queryable, QueryFilters } from 'src/lib/query-filters'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserResponse } from './response/user.response'
import { UsersPageResponse } from './response/users-page.response'
import { UsersService } from './users.service'

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedResponse({ type: UserResponse })
  @ApiBadRequestResponse({ description: 'User already exists' })
  @Auth([Role.ADMIN])
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.create(createUserDto)
  }

  @ApiOkResponse({ type: UsersPageResponse })
  @Auth()
  @Get()
  @Queryable()
  findAll(@QueryFilters() filters: Filters): Promise<UsersPageResponse> {
    return this.usersService.findAll(filters)
  }

  @ApiOkResponse({ type: UserResponse })
  @ApiBadRequestResponse({ description: 'User not exists!' })
  @Auth()
  @Get(':id')
  @Queryable({ pagination: false })
  findOne(@Param('id') id: Uuid, @QueryFilters() filters: Filters): Promise<UserResponse> {
    return this.usersService.findOne(id, filters)
  }

  @ApiOkResponse({ type: UserResponse })
  @Auth()
  @Patch(':id')
  update(@Param('id') id: Uuid, @Body() updateUserDto: UpdateUserDto): Promise<UserResponse> {
    return this.usersService.update(id, updateUserDto)
  }

  @ApiBadRequestResponse({ description: 'User not exists!' })
  @Delete(':id')
  @Auth([Role.ADMIN])
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Uuid): Promise<void> {
    return this.usersService.remove(id)
  }
}
