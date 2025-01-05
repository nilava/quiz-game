import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token not provided');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      req['user'] = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
