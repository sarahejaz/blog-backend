import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { BlogController } from './blog/blog.controller';
import { BlogModule } from './blog/blog.module';
import { CommonModule } from './common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UsersModule,
    AuthModule,
    BlogModule,
    MongooseModule.forRoot(
      ${{ secrets.MONGODB_URI }}
    ),
    CommonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' }
    }),
    AdminModule
  ],
  controllers: [
    AppController,
    UsersController,
    AuthController,
    BlogController,
    AdminController
  ],
  providers: [AppService]
})
export class AppModule {}
