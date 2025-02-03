import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'];

    if (!token || !this.authService.verifyToken(token.replace('Bearer ', ''))) {
      throw new UnauthorizedException('Token inválido o no proporcionado');
    }

    next();
  }
}