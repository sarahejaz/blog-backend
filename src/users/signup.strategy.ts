import { Injectable, NotAcceptableException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from './users.service';

@Injectable()
export class SignupStrategy extends PassportStrategy(Strategy, 'signup') {
  constructor(private usersService: UsersService) {
    super();
  }

  async validate(email: string): Promise<any> {
    const user = await this.usersService.checkExistingEmail(email);

    if (user) {
      throw new NotAcceptableException('Email already in use');
    }

    return null;
  }
}
