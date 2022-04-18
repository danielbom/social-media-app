import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/app/users/entities/role.enum';
import { User } from 'src/app/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    return roles.includes(user.role);
  }
}
