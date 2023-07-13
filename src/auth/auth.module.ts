import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/user.model';
import { ConfigModule } from '@nestjs/config';
import { AuthenticatedGuard } from './authenticated.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' }
    }),
    MongooseModule.forFeature([{ name: 'user', schema: UserSchema }])
  ],
  providers: [AuthService, AuthenticatedGuard],
  exports: [AuthService]
})
export class AuthModule {}
