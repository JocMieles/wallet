import { Controller, Post, Body } from '@nestjs/common';
import { SoapService } from 'src/services/soap.service';

@Controller('clients')
export class ClientController {
  constructor(private readonly soapService: SoapService) {}

  @Post('register')
  async registerClient(@Body() body: { document: string; name: string; email: string; phone: string }) {
    const response = await this.soapService.callSoapMethod('registerClient', body);
    return response;
  }
}