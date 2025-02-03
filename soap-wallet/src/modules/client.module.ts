import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientService } from '../services/client.service';
import { ClientController } from '../controllers/client.controller';
import { Client, ClientSchema } from '../models/client.model';
import { ClientRepository } from 'src/repositories/client.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Client.name, schema: ClientSchema }]),
  ],
  providers: [ClientService, ClientRepository],
  controllers: [ClientController],
  exports: [ClientService, ClientRepository, MongooseModule],
})
export class ClientModule {}