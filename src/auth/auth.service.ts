import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateByUsername(username: string, password: string): Promise<any> {
    const user = await this.usersService.getUser({ username });

    if (!user) {
      throw new NotAcceptableException('User not found');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new NotAcceptableException('Incorrect password');
    }

    if (user && passwordValid) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async validateByEmail(email: string, password: string): Promise<any> {
    const user = await this.usersService.getUser({ email });

    if (!user) {
      throw new NotAcceptableException('Email not found');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new NotAcceptableException('Incorrect password');
    }

    if (user && passwordValid) {
      const { password, ...rest } = user;
      return rest;
    }

    return null;
  }

  async login(user: any) {
    let payload = { email: user.email, sub: user.id };
    const userFound = await this.usersService.getUser({ email: user.email });
    const userObj: any = userFound;

    return {
      accessToken: this.jwtService.sign(payload),
      userId: userObj._id,
      username: userFound?.username,
      email: userFound?.email,
      firstName: userFound?.firstName,
      lastName: userFound?.lastName,
      role: userFound?.role
    };
  }
}
