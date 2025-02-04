import { Test, TestingModule } from '@nestjs/testing';
import { ClientRepository } from './client.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Client } from '../models/client.model';
import { Model } from 'mongoose';

describe('ClientRepository', () => {
  let repository: ClientRepository;
  let modelMock: Partial<Model<Client>>;

  beforeEach(async () => {
    modelMock = {
      create: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, _id: '123' })),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      findOneAndUpdate: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientRepository,
        { provide: getModelToken(Client.name), useValue: modelMock },
      ],
    }).compile();

    repository = module.get<ClientRepository>(ClientRepository);
  });

  it('debería crear un cliente correctamente', async () => {
    const mockClient = {
      _id: '123',
      document: '123456789',
      email: 'juan@test.com',
      name: 'Juan',
      phone: '3001234567',
    };

    const result = await repository.create(mockClient);

    expect(modelMock.create).toHaveBeenCalledWith(mockClient);
    
    expect(result).toEqual(mockClient);
  });

  it('debería encontrar un cliente por documento', async () => {
    const mockClient = { document: '123456789', name: 'Juan', email: 'juan@test.com', phone: '3001234567' };

    (modelMock.findOne as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockClient),
    });

    const result = await repository.findByDocument('123456789');
    expect(result).toEqual(mockClient);
  });

  it('debería encontrar un cliente por teléfono', async () => {
    const mockClient = { document: '123456789', phone: '3001234567' };

    (modelMock.findOne as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockClient),
    });

    const result = await repository.findByPhone('3001234567');
    expect(result).toEqual(mockClient);
  });

  it('debería encontrar un cliente por email', async () => {
    const mockClient = { document: '123456789', email: 'juan@test.com' };

    (modelMock.findOne as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockClient),
    });

    const result = await repository.findByEmail('juan@test.com');
    expect(result).toEqual(mockClient);
  });

  it('debería encontrar un cliente por documento y teléfono', async () => {
    const mockClient = { document: '123456789', phone: '3001234567' };

    (modelMock.findOne as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockClient),
    });

    const result = await repository.findByDocumentAndPhone('123456789', '3001234567');
    expect(result).toEqual(mockClient);
  });

  it('debería actualizar el código de validación', async () => {
    const updatedClient = { token: '123456', session_id: 'abc123', amount: 500 };

    (modelMock.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedClient);

    const result = await repository.updateValidationCode('client123', '123456', 'abc123', 500);
    expect(result).toEqual(updatedClient);
  });

  it('debería encontrar un cliente por session_id', async () => {
    const mockClient = { session_id: 'abc123', document: '123456789' };

    (modelMock.findOne as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockClient),
    });

    const result = await repository.findBySessionId('abc123');
    expect(result).toEqual(mockClient);
  });
});