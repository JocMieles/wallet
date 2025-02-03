import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from 'src/models/wallet.model';

@Injectable()
export class WalletRepository {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {}

  async findByDocument(document: string): Promise<Wallet | null> {
    return this.walletModel.findOne({ document }).exec();
  }

  async create(clientId: string): Promise<Wallet> {
    return new this.walletModel({ clientId }).save();
  }

}