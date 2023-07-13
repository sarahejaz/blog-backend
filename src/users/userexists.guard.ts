import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest().body;
    return !(await this.usersService.checkExistingEmail(user.email));
  }
}
