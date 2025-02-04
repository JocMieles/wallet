import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from '../../src/controllers/wallet.controller';
import { SoapService } from '../../src/services/soap.service';

jest.mock('../../src/services/soap.service');

describe('WalletController', () => {
  let walletController: WalletController;
  let soapService: jest.Mocked<SoapService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [SoapService],
    }).compile();

    walletController = module.get<WalletController>(WalletController);
    soapService = module.get(SoapService);
  });

  describe('Recargar Billetera', () => {
    it('Debe llamar a SOAP con los datos correctos', async () => {
      const mockResponse = { success: true, cod_error: '00', message_error: 'Billetera recargada exitosamente' };
      soapService.callSoapMethod.mockResolvedValue(mockResponse);

      const result = await walletController.rechargeWallet({ document: '12345', phone: '555-1234', amount: 50 });

      expect(soapService.callSoapMethod).toHaveBeenCalledWith('rechargeWallet', { document: '12345', phone: '555-1234', amount: 50 });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Realizar Pago', () => {
    it('Debe llamar a SOAP para realizar un pago', async () => {
      const mockResponse = { success: true, cod_error: '00', message_error: 'Pago iniciado' };
      soapService.callSoapMethod.mockResolvedValue(mockResponse);

      const result = await walletController.pay({ document: '12345', phone: '555-1234', amount: 50 });

      expect(soapService.callSoapMethod).toHaveBeenCalledWith('pay', { document: '12345', phone: '555-1234', amount: 50 });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Confirmar Pago', () => {
    it('Debe llamar a SOAP para confirmar un pago', async () => {
      const mockResponse = { success: true, cod_error: '00', message_error: 'Pago confirmado' };
      soapService.callSoapMethod.mockResolvedValue(mockResponse);

      const result = await walletController.confirmPayment({ session_id: 'session123', token: 123456 });

      expect(soapService.callSoapMethod).toHaveBeenCalledWith('confirmPayment', { session_id: 'session123', token: 123456 });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('Consultar Saldo', () => {
    it('Debe llamar a SOAP para consultar el saldo', async () => {
      const mockResponse = { success: true, cod_error: '00', message_error: 'Consulta de saldo exitosa', saldo: 100 };
      soapService.callSoapMethod.mockResolvedValue(mockResponse);

      const result = await walletController.checkBalance({ document: '12345', phone: '555-1234' });

      expect(soapService.callSoapMethod).toHaveBeenCalledWith('checkBalance', { document: '12345', phone: '555-1234' });
      expect(result).toEqual(mockResponse);
    });
  });
});