import { AuthMiddleware } from './auth.middleware';
import { AuthService } from '../../src/services/auth.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let authService: jest.Mocked<AuthService>;
  let mockRequest: any;
  let mockResponse: any;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    authService = { verifyToken: jest.fn() } as any;
    authMiddleware = new AuthMiddleware(authService);
    nextFunction = jest.fn();
  });

  describe('Token válido', () => {
    it('Debe permitir la solicitud si el token es válido', () => {
      mockRequest = {
        headers: { authorization: 'Bearer valid-token' },
      };

      authService.verifyToken.mockReturnValue(true);

      authMiddleware.use(mockRequest, mockResponse, nextFunction);

      expect(authService.verifyToken).toHaveBeenCalledWith('valid-token');
      expect(nextFunction).toHaveBeenCalled();
    });
  });

  describe('Token inválido o ausente', () => {
    it('Debe lanzar UnauthorizedException si el token no es proporcionado', () => {
      mockRequest = { headers: {} };

      expect(() => authMiddleware.use(mockRequest, mockResponse, nextFunction))
        .toThrowError(new UnauthorizedException('Token inválido o no proporcionado'));

      expect(authService.verifyToken).not.toHaveBeenCalled();
      expect(nextFunction).not.toHaveBeenCalled();
    });

    it('Debe lanzar UnauthorizedException si el token es inválido', () => {
      mockRequest = {
        headers: { authorization: 'Bearer invalid-token' },
      };

      authService.verifyToken.mockReturnValue(false);

      expect(() => authMiddleware.use(mockRequest, mockResponse, nextFunction))
        .toThrowError(new UnauthorizedException('Token inválido o no proporcionado'));

      expect(authService.verifyToken).toHaveBeenCalledWith('invalid-token');
      expect(nextFunction).not.toHaveBeenCalled();
    });
  });
});