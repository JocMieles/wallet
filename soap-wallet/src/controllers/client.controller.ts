import { Controller } from '@nestjs/common';
import { ClientService } from 'src/services/client.service';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  async registerClient(data: { document: string; name: string; email: string; phone: string }) {
    return this.clientService.registerClient(data);
  }
}