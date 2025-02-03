import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConfig } from './config/database.config';
import { ClientController } from './controllers/client.controller';
import { ClientModule } from './modules/client.module';
import { SoapServer } from './soap/soap.server';
import { WalletController } from './controllers/wallet.controller';
import { WalletModule } from './modules/wallet.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/soap_wallet'),
    DatabaseConfig,
    ClientModule,
    WalletModule
  ],
  controllers: [ClientController, WalletController],
  providers: [SoapServer],
  exports: [SoapServer],
})
export class AppModule {}