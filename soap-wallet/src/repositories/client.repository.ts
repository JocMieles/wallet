import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from '../models/client.model';

@Injectable()
export class ClientRepository {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  async create(clientData: Partial<Client>): Promise<Client> {
    return this.clientModel.create(clientData);
  }


  async findByDocument(document: string): Promise<Client | null> {
    return this.clientModel.findOne({ document }).exec();
  }

  async findByPhone(phone: string): Promise<Client | null> {
    return this.clientModel.findOne({ phone }).exec();
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.clientModel.findOne({ email }).exec();
  }

  async findByDocumentAndPhone(document: string, phone: string): Promise<Client | null> {
    return this.clientModel.findOne({ document, phone }).exec();
  }

  async updateValidationCode(clientId: string, token: string, session_id: string, amount: number): Promise<Client | null> {
    return (
      await this.clientModel.findOneAndUpdate(
        { _id: clientId },
        { token, session_id, amount },
        { new: true }
      )
    ) || null;
  }

  async findBySessionId(session_id: string): Promise<Client | null> {
    return this.clientModel.findOne({ session_id }).exec();
  }
}