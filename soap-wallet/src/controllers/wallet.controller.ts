import { Controller } from '@nestjs/common';
import { WalletService } from '../services/wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  async createWallet(data: { clienteId: string; amount: number }) {
    return this.walletService.createWallet(data);
  }

  async rechargeWallet(data: { document: string; phone: string; amount: number }) {
    return this.walletService.rechargeWallet(data);
  }

}