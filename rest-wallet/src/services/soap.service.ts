import { Injectable } from '@nestjs/common';
import * as soap from 'soap';

@Injectable()
export class SoapService {
  private soapUrl = process.env.SOAP_URL || 'http://soap-wallet:4000/wallet?wsdl';

  async callSoapMethod(method: string, args: any) {
    try {
      const client = await soap.createClientAsync(this.soapUrl);
      const [result] = await client[method + 'Async'](args);
      return result;
    } catch (error) {
      console.error(`Error en SOAP (${method}):`, error);
      return { success: false, cod_error: '99', message_error: 'Error al conectar con el servicio SOAP' };
    }
  }
}