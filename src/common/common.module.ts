import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { VerifyTokenGuard } from './VerifyTokenGuard.guard';
import { CommonController } from './common.controller';
import { CommonService } from './common.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' }
    })
  ],
  providers: [VerifyTokenGuard, CommonService],
  exports: [CommonService],
  controllers: [CommonController]
})
export class CommonModule {}
