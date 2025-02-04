import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from '../models/wallet.model';
import { ObjectId } from 'mongodb';

@Injectable()
export class WalletRepository {
  constructor(@InjectModel(Wallet.name) private walletModel: Model<Wallet>) {}

  async create(clientId: string): Promise<Wallet> {
    return this.walletModel.create({ clientId });
  }

  async updateBalance(clientId: string, amount: number): Promise<Wallet | null> {
    console.log('document', clientId);
    const wallet = await this.walletModel.findOne({ clientId: new ObjectId(clientId) });
    console.log('wallet2', wallet);
    if (!wallet) {
      return null;
    }

    return this.walletModel.findOneAndUpdate({ clientId: new ObjectId(clientId) }, { $inc: { balance: amount } }, { new: true });
  }

  async findByClientId(clientId: string): Promise<Wallet | null> {
    return this.walletModel.findOne({ clientId: new ObjectId(clientId) }).exec();
  }

}