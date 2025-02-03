import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly secretKey = process.env.JWT_SECRET_KEY;

  generateToken(): { success: boolean; token: string } {
    console.log(this.secretKey)
    const token = jwt.sign({}, this.secretKey, { expiresIn: '1h' });
    return {
      success: true,
      token,
    };
  }

  verifyToken(token: string): boolean {
    try {
      jwt.verify(token, this.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}