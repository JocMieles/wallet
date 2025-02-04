import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from '../services/wallet.service';
import { WalletRepository } from '../repositories/wallet.repository';
import { WalletController } from '../controllers/wallet.controller';
import { Wallet, WalletSchema } from '../models/wallet.model';
import { ClientModule } from './client.module'; // ✅ Importar ClientModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    ClientModule,
  ],
  providers: [WalletService, WalletRepository],
  controllers: [WalletController],
  exports: [WalletService, WalletRepository],
})
export class WalletModule {}