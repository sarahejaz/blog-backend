import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.model';
import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';
import { UserExistsGuard } from './userexists.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(UserExistsGuard)
  @Post('signup')
  async createUser(
    @Body('password') password: string,
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string
  ): Promise<User> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    const result = await this.usersService.createUser(
      username,
      email,
      hashedPassword,
      firstName,
      lastName
    );
    return result;
  }

  @Get('id/:id')
  async getUserProfileById(@Param() params: any): Promise<User> {
    const user = await this.usersService.getUserById(params.id);

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  @Get('username/:username')
  async getUserProfileByUsername(@Param() params: any): Promise<User> {
    const user = await this.usersService.getUserByQuery({
      username: params.username
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }
}
