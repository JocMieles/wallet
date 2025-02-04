import { Test, TestingModule } from '@nestjs/testing';
import { WalletRepository } from './wallet.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Wallet } from '../models/wallet.model';
import { Model } from 'mongoose';

describe('WalletRepository', () => {
  let repository: WalletRepository;
  let modelMock: Partial<Model<Wallet>>;

  beforeEach(async () => {
    modelMock = {
      create: jest.fn().mockImplementation((data) => Promise.resolve({ ...data, _id: 'wallet123', balance: 0 })),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      }),
      findOneAndUpdate: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletRepository,
        { provide: getModelToken(Wallet.name), useValue: modelMock },
      ],
    }).compile();

    repository = module.get<WalletRepository>(WalletRepository);
  });

  it('debería crear una billetera correctamente', async () => {
    const mockWallet = {
      _id: 'wallet123',
      clientId: 'client123',
      balance: 0,
    };

    const result = await repository.create(mockWallet.clientId);

    expect(modelMock.create).toHaveBeenCalledWith({ clientId: mockWallet.clientId });

    expect(result).toEqual(mockWallet);
  });

  it('debería encontrar una billetera por clientId', async () => {
    const mockWallet = { _id: 'wallet123', clientId: 'client123', balance: 500 };

    (modelMock.findOne as jest.Mock).mockReturnValueOnce({
      exec: jest.fn().mockResolvedValue(mockWallet),
    });

    const result = await repository.findByClientId('client123');
    expect(result).toEqual(mockWallet);
  });

  it('debería actualizar el saldo correctamente', async () => {
    const updatedWallet = { _id: 'wallet123', clientId: 'client123', balance: 1000 };

    (modelMock.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedWallet);

    const result = await repository.updateBalance('client123', 500);
    expect(result).toEqual(updatedWallet);
  });
});