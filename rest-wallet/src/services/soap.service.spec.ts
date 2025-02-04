import { Test, TestingModule } from '@nestjs/testing';
import { SoapService } from '../../src/services/soap.service';
import * as soap from 'soap';

jest.mock('soap');

describe('SoapService', () => {
  let soapService: SoapService;
  let mockClient: any;
  const soapUrl = process.env.SOAP_URL || 'http://soap-wallet:4000/wallet?wsdl';

  beforeEach(async () => {
    process.env.SOAP_URL = soapUrl;

    const module: TestingModule = await Test.createTestingModule({
      providers: [SoapService],
    }).compile();

    soapService = module.get<SoapService>(SoapService);

    mockClient = {
      rechargeWalletAsync: jest.fn().mockResolvedValue([{ success: true, cod_error: '00', message_error: 'Recarga exitosa' }]),
    };

    (soap.createClientAsync as jest.Mock).mockResolvedValue(mockClient);
  });

  describe('🟢 Llamadas a métodos SOAP', () => {
    it('✅ Debe llamar a `rechargeWallet` correctamente', async () => {
      const requestData = { document: '12345', phone: '555-1234', amount: 50 };

      const result = await soapService.callSoapMethod('rechargeWallet', requestData);

      expect(soap.createClientAsync).toHaveBeenCalledWith(soapUrl);
      expect(mockClient.rechargeWalletAsync).toHaveBeenCalledWith(requestData);
      expect(result).toEqual({ success: true, cod_error: '00', message_error: 'Recarga exitosa' });
    });

    it('❌ Debe manejar errores al conectar con SOAP', async () => {
      (soap.createClientAsync as jest.Mock).mockRejectedValue(new Error('Error de conexión'));

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Evita que Jest lo capture

      const result = await soapService.callSoapMethod('rechargeWallet', { document: '12345' });

      expect(result).toEqual({ success: false, cod_error: '99', message_error: 'Error al conectar con el servicio SOAP' });

      consoleSpy.mockRestore(); // Restaurar el console.error
    });
  });
});