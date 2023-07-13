import {
  Injectable,
  NotFoundException,
  NotAcceptableException,
  Controller,
  Get,
  StreamableFile,
  Res,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CommonService {
  constructor(private jwtService: JwtService) {}

  async verifyToken(token: string): Promise<Boolean> {
    try {
      const verifyResponse = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET
      });
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
