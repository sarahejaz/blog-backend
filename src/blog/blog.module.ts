import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogSchema } from './blog.model';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'blog', schema: BlogSchema }]),
    UsersModule,
    CommonModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' }
    })
  ],
  providers: [BlogService],
  exports: [BlogService],
  controllers: [BlogController]
})
export class BlogModule {}
