import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { ClientRepository } from '../repositories/client.repository';

describe('ClientService', () => {
  let service: ClientService;
  let clientRepositoryMock = {
    create: jest.fn(),
    findByDocument: jest.fn(),
    findByPhone: jest.fn(),
    findByEmail: jest.fn(), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        { provide: ClientRepository, useValue: clientRepositoryMock },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

  it('debería registrar un cliente correctamente', async () => {
    const mockClient = { document: '123456789', name: 'Juan', email: 'juan@test.com', phone: '3001234567' };
    clientRepositoryMock.create.mockResolvedValue(mockClient);

    const result = await service.registerClient(mockClient);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockClient);
  });

  it('debería fallar si el documento ya existe', async () => {
    clientRepositoryMock.findByDocument.mockResolvedValue(true);
    const mockClient = { document: '123456789', name: 'Juan', email: 'juan@test.com', phone: '3001234567' };

    const result = await service.registerClient(mockClient);
    expect(result.success).toBe(false);
    expect(result.cod_error).toBe('01');
  });

});