import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagSchema } from './tags.model';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UserSchema } from '../users/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'tag', schema: TagSchema },
      { name: 'user', schema: UserSchema }
    ])
  ],
  providers: [AdminService],
  exports: [AdminService],
  controllers: [AdminController]
})
export class AdminModule {}
