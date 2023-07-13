import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class VerifyTokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const data = context.switchToHttp().getRequest().headers;

    if (data.hasOwnProperty('authorization')) {
      const token = data['authorization'].split(' ')[1];
      try {
        const verifyResponse = await this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET
        });
        return true;
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      throw new UnauthorizedException('Token not provided');
    }
  }
}
