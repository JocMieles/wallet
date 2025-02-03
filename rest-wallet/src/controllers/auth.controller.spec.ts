import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/controllers/auth.controller';
import { AuthService } from '../../src/services/auth.service';

jest.mock('../../src/services/auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('🟢 Generar Token', () => {
    it('✅ Debe llamar a AuthService y retornar un token', () => {
      const mockResponse = { success: true, token: 'mocked-jwt-token' };
      authService.generateToken.mockReturnValue(mockResponse);

      const result = authController.generateToken();

      expect(authService.generateToken).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });
});