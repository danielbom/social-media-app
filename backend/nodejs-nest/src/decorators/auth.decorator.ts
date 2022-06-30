import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from 'src/entities/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

export function Auth(roles: Role[] = []) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
  );
}
