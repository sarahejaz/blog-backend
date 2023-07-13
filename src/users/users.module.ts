import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { SignupStrategy } from './signup.strategy';
import { UserExistsGuard } from './userexists.guard';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])],
  providers: [UsersService, SignupStrategy, UserExistsGuard],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
