import { Controller, Post, Get, Body } from '@nestjs/common';
import { SoapService } from '../services/soap.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly soapService: SoapService) {}

  @Post('recharge')
  async rechargeWallet(@Body() body: { document: string; phone: string; amount: number }) {
    return await this.soapService.callSoapMethod('rechargeWallet', body);
  }

  @Post('pay')
  async pay(@Body() body: { document: string; phone: string; amount: number }) {
    return await this.soapService.callSoapMethod('pay', body);
  }

  @Post('confirm')
  async confirmPayment(@Body() body: { session_id: string; token: number }) {
    return await this.soapService.callSoapMethod('confirmPayment', body);
  }

  @Get('balance')
  async checkBalance(@Body() body: { document: string; phone: string }) {
    return await this.soapService.callSoapMethod('checkBalance', body);
  }
}