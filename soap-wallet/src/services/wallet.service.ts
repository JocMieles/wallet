import { Injectable } from '@nestjs/common';
import { WalletRepository } from 'src/repositories/wallet.repository';


@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository
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

}