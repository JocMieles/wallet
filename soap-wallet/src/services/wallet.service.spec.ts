import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { WalletRepository } from '../repositories/wallet.repository';
import { ClientRepository } from '../repositories/client.repository';
import { randomInt } from 'crypto';
import { ObjectId } from 'mongodb';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn((mailOptions, callback) => callback(null, { response: 'Correo enviado con éxito' })),
  }),
}));

describe('WalletService', () => {
  let service: WalletService;
  let walletRepositoryMock = {
    create: jest.fn(),
    findByDocument: jest.fn(),
    findByClientId: jest.fn(),
    updateBalance: jest.fn(),
  };
  let clientRepositoryMock = {
    findByDocument: jest.fn(),
    findByDocumentAndPhone: jest.fn(),
    updateValidationCode: jest.fn(),
    findBySessionId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: WalletRepository, useValue: walletRepositoryMock },
        { provide: ClientRepository, useValue: clientRepositoryMock },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('debería crear una billetera correctamente', async () => {
    const clientId = new ObjectId(123);
    walletRepositoryMock.findByDocument.mockResolvedValue(null);
    walletRepositoryMock.create.mockResolvedValue({clienteId: clientId.toString(), balance: 0 });

    const result = await service.createWallet({ clienteId: clientId.toString(), amount: 0 });
    expect(result.success).toBe(true);
    expect(result.cod_error).toBe('00');
    expect(result?.data?.saldo).toBe(0);
  });

  it('debería fallar al crear una billetera si ya existe', async () => {
    const clientId = new ObjectId(123);

    walletRepositoryMock.findByClientId.mockResolvedValue({ clientId, balance: 0 });

    const result = await service.createWallet({ clienteId: clientId.toString(), amount: 0 });

    expect(result.success).toBe(false);
    expect(result.cod_error).toBe('01');
});
  it('debería recargar la billetera correctamente', async () => {
    clientRepositoryMock.findByDocument.mockResolvedValue({ id: '123', document: '123456789', phone: '3001234567' });
    walletRepositoryMock.updateBalance.mockResolvedValue({ balance: 1000 });

    const result = await service.rechargeWallet({ document: '123456789', phone: '3001234567', amount: 500 });
    expect(result.success).toBe(true);
    expect(result?.data?.saldo).toBe(1000);
  });

  it('debería fallar si el cliente no existe en recarga', async () => {
    clientRepositoryMock.findByDocument.mockResolvedValue(null);

    const result = await service.rechargeWallet({ document: '123456789', phone: '3001234567', amount: 500 });
    expect(result.success).toBe(false);
    expect(result.cod_error).toBe('02');
  });

  it('debería fallar si el saldo es insuficiente para pagar', async () => {
    clientRepositoryMock.findByDocumentAndPhone.mockResolvedValue({ id: '123', document: '123456789', phone: '3001234567' });
    walletRepositoryMock.findByClientId.mockResolvedValue({ balance: 200 });

    const result = await service.pay({ document: '123456789', phone: '3001234567', amount: 500 });
    expect(result.success).toBe(false);
    expect(result.cod_error).toBe('03');
  });

  it('debería generar un token y sesión para pago si hay saldo suficiente', async () => {
    clientRepositoryMock.findByDocumentAndPhone.mockResolvedValue({ id: '123', document: '123456789', phone: '3001234567', email: 'test@example.com' });
    walletRepositoryMock.findByClientId.mockResolvedValue({ balance: 1000 });
    clientRepositoryMock.updateValidationCode.mockResolvedValue({ token: '654321', session_id: 'session_123' });

    const result = await service.pay({ document: '123456789', phone: '3001234567', amount: 500 });
    expect(result.success).toBe(true);
    expect(result.cod_error).toBe('00');
    expect(result?.data?.session_id).toBeDefined();
  });

  it('debería fallar si el token de confirmación es incorrecto', async () => {
    clientRepositoryMock.findBySessionId.mockResolvedValue({ session_id: 'session_123', token: '654321', amount: 500 });

    const result = await service.confirmPayment({ session_id: 'session_123', token: 123456 });
    expect(result.success).toBe(false);
    expect(result.cod_error).toBe('04');
  });

  it('debería confirmar un pago si el token es correcto', async () => {
    clientRepositoryMock.findBySessionId.mockResolvedValue({ id: '123', session_id: 'session_123', token: '654321', amount: 500 });
    walletRepositoryMock.findByClientId.mockResolvedValue({ balance: 1000 });
    walletRepositoryMock.updateBalance.mockResolvedValue({ balance: 500 });

    const result = await service.confirmPayment({ session_id: 'session_123', token: 654321 });
    expect(result.success).toBe(true);
    expect(result.cod_error).toBe('00');
  });

  it('debería devolver el saldo de la billetera', async () => {
    clientRepositoryMock.findByDocument.mockResolvedValue({ id: '123', document: '123456789', phone: '3001234567' });
    walletRepositoryMock.findByClientId.mockResolvedValue({ balance: 1500 });

    const result = await service.checkBalance({ document: '123456789', phone: '3001234567' });
    expect(result.success).toBe(true);
    expect(result.cod_error).toBe('00');
    expect(result?.data?.saldo).toBe(1500);
  });

  it('debería fallar si el cliente no existe en consulta de saldo', async () => {
    clientRepositoryMock.findByDocument.mockResolvedValue(null);

    const result = await service.checkBalance({ document: '123456789', phone: '3001234567' });
    expect(result.success).toBe(false);
    expect(result.cod_error).toBe('02');
  });
});