import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/app/users/entities/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';

export function Auth(roles: Role[] = []): MethodDecorator {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard(), RolesGuard),
  );
}
