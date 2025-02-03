import { Injectable } from '@nestjs/common';
import { ClientRepository } from 'src/repositories/client.repository';
import { WalletRepository } from 'src/repositories/wallet.repository';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository, private readonly clientRepository: ClientRepository
  ) { }

  async createWallet(data: { clienteId: string; amount: number }) {
    const existingWallet = await this.walletRepository.findByDocument(data.clienteId);
    if (existingWallet) {
      return { success: false, cod_error: '01', message_error: 'La billetera ya existe' };
    }

    const wallet = await this.walletRepository.create(data.clienteId);
    return {
      success: true,
      cod_error: '00',
      message_error: 'Billetera creada exitosamente',
      data: {
        clienteId: wallet.clientId,
        saldo: wallet.balance,
      }
    };
  }

  async rechargeWallet(data: { document: string; phone: string; amount: number }) {
    const client = await this.clientRepository.findByDocument(data.document);
    console.log('Cliente encontrado:', client);

    if (!client || client.phone !== data.phone) {
      return { success: false, cod_error: '02', message_error: 'Cliente no encontrado o el teléfono no coincide' };
    }

    const wallet = await this.walletRepository.updateBalance(client.id, data.amount);
    console.log('Billetera actualizada:', wallet);

    return {
      success: true,
      cod_error: '00',
      message_error: 'Billetera recargada exitosamente',
      data: {
        saldo: wallet?.balance
      }
    };
  }

}