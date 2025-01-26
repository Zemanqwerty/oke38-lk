import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from "src/users/users.service";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService, // Инжектируйте ваш сервис
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true; // Если роли не указаны, доступ разрешен
    }

    const request = context.switchToHttp().getRequest();
    const userEmail = request.user?.publickUserEmail; // Предположим, что email пользователя хранится в токене

    if (!userEmail) {
      throw new ForbiddenException('User not found');
    }

    const user = await this.usersService.getActivatedUserByEmail(userEmail);

    if (!roles.includes(user.id_userrole.caption_userrole)) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}