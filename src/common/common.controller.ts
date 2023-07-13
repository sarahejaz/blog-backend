import {
  Body,
  Controller,
  Get,
  Param,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonService } from './common.service';

@Controller('common')
export class CommonController {
  constructor(
    private jwtService: JwtService,
    private commonService: CommonService
  ) {}

  @Get('verifyToken/:token')
  async verifyToken(@Param() params: any) {
    const data = params.token;

    if (data) {
      const response = await this.commonService.verifyToken(data);
      if (response) {
        return { message: 'Token is valid' };
      }
    } else {
      throw new UnauthorizedException('Token not provided');
    }
  }
}
