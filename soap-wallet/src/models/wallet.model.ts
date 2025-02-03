import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Wallet extends Document {
  @Prop({ required: true, unique: true, type: Types.ObjectId, ref: 'Client' })
  clientId: Types.ObjectId;

  @Prop({ default: 0 })
  balance: number;
  amount: any;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);