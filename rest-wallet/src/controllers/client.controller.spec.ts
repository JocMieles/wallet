import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from '../../src/controllers/client.controller';
import { SoapService } from '../../src/services/soap.service';

jest.mock('../../src/services/soap.service');

describe('ClientController', () => {
  let clientController: ClientController;
  let soapService: jest.Mocked<SoapService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [SoapService],
    }).compile();

    clientController = module.get<ClientController>(ClientController);
    soapService = module.get(SoapService);
  });

  describe('Registro de Cliente', () => {
    it('Debe llamar a SOAP con los datos correctos para registrar un cliente', async () => {
      const mockResponse = { success: true, cod_error: '00', message_error: 'Cliente registrado exitosamente' };
      soapService.callSoapMethod.mockResolvedValue(mockResponse);

      const requestData = {
        document: '12345678',
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        phone: '555-9876',
      };

      const result = await clientController.registerClient(requestData);

      expect(soapService.callSoapMethod).toHaveBeenCalledWith('registerClient', requestData);
      expect(result).toEqual(mockResponse);
    });

    it('Debe manejar errores si el servicio SOAP falla', async () => {
      soapService.callSoapMethod.mockResolvedValue({ success: false, cod_error: '99', message_error: 'Error en SOAP' });

      const requestData = {
        document: '87654321',
        name: 'Maria López',
        email: 'maria.lopez@example.com',
        phone: '555-1234',
      };

      const result = await clientController.registerClient(requestData);

      expect(soapService.callSoapMethod).toHaveBeenCalledWith('registerClient', requestData);
      expect(result).toEqual({ success: false, cod_error: '99', message_error: 'Error en SOAP' });
    });
  });
});