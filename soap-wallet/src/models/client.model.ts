import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Client extends Document {
  @Prop({ required: true, unique: true })
  document: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: false})
  token: number;

  @Prop({ required: false})
  session_id: string;

  @Prop({ required: false})
  amount: number;
}

export const ClientSchema = SchemaFactory.createForClass(Client);