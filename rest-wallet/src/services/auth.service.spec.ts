import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/services/auth.service';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  const mockSecretKey = 'mock-secret-key';

  beforeEach(async () => {
    process.env.JWT_SECRET_KEY = mockSecretKey; // Simula la clave secreta del entorno

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('🟢 Generar Token', () => {
    it('✅ Debe generar un token JWT válido', () => {
      const mockToken = 'mocked-jwt-token';
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = authService.generateToken();

      expect(jwt.sign).toHaveBeenCalledWith({}, mockSecretKey, { expiresIn: '1h' });
      expect(result).toEqual({ success: true, token: mockToken });
    });
  });

  describe('🟢 Verificar Token', () => {
    it('✅ Debe retornar true si el token es válido', () => {
      const validToken = 'valid-jwt-token';
      (jwt.verify as jest.Mock).mockReturnValue({});

      const result = authService.verifyToken(validToken);

      expect(jwt.verify).toHaveBeenCalledWith(validToken, mockSecretKey);
      expect(result).toBe(true);
    });

    it('❌ Debe retornar false si el token es inválido', () => {
      const invalidToken = 'invalid-jwt-token';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = authService.verifyToken(invalidToken);

      expect(jwt.verify).toHaveBeenCalledWith(invalidToken, mockSecretKey);
      expect(result).toBe(false);
    });
  });
});