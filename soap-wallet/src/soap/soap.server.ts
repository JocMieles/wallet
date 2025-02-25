import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
import * as http from 'http';
import { ClientService } from '../services/client.service';
import { WalletService } from '../services/wallet.service';
import { wsdl } from './soap.wsdl';

@Injectable()
export class SoapServer {
  constructor(
    private readonly clientService: ClientService,
    private readonly walletService: WalletService
  ) {}

  async startServer() {
    const service = {
      WalletService: {
        WalletPort: {
          registerClient: async (args: any, callback: any) => {
            try {
              const clientResponse = await this.clientService.registerClient(args);
              
              if (!clientResponse.success) {
                return callback(null, clientResponse);
              }

              console.log('Cliente registrado:', clientResponse);

              const walletResponse = await this.walletService.createWallet({
                clienteId: clientResponse?.clientId,
                amount: 0,
              });

              if (!walletResponse.success) {
                return callback(null, walletResponse);
              }

              callback(null, { 
                success: true, 
                cod_error: '00', 
                message_error: 'Cliente registrado y billetera creada exitosamente',
                data: {
                  cliente: clientResponse.data,
                },
              });
            } catch (error) {
              console.error('Error SOAP:', error);
              callback({
                success: false,
                cod_error: '99',
                message_error: 'Error interno del servidor',
              });
            }
          },

          rechargeWallet: async (args: any, callback: any) => {
            try {
              console.log("Solicitud SOAP - Recarga de billetera:", args);
              const response = await this.walletService.rechargeWallet(args);

              if (!response.success) {
                return callback(null, response);
              }

              callback(null, { 
                success: true, 
                cod_error: '00', 
                message_error: 'Billetera recargada exitosamente',
                data: response.data,
              });
            } catch (error) {
              console.error('Error SOAP:', error);
              callback({
                success: false,
                cod_error: '99',
                message_error: 'Error interno del servidor',
              });
            }
          },
          pay: async (args: any, callback: any) => {
            try {
              console.log("Solicitud SOAP - Pago:", args);
              const response = await this.walletService.pay(args);

              if (!response.success) {
                return callback(null, response);
              }

              callback(null, { 
                success: true, 
                cod_error: '00', 
                message_error: 'Saldo suficiente, por favor confirma el pago con el codigo enviado al correo y el session_id',
                data: {message: response.message_error, session_id: response?.data?.session_id},
              });
            } catch (error) {
              console.error('Error SOAP:', error);
              callback({
                success: false,
                cod_error: '99',
                message_error: 'Error interno del servidor',
              });
            }
          },
          confirmPayment: async (args: any, callback: any) => {
            try {
              console.log("Solicitud SOAP - Confirmación de pago:", args);
              const response = await this.walletService.confirmPayment(args);

              if (!response.success) {
                return callback(null, response);
              }

              callback(null, { 
                success: true, 
                cod_error: '00', 
                message_error: 'Pago confirmado exitosamente',
              });
            } catch (error) {
              console.error('Error SOAP:', error);
              callback({
                success: false,
                cod_error: '99',
                message_error: 'Error interno del servidor',
              });
            }
          },
          checkBalance: async (args: any, callback: any) => {
            try {
              console.log("Solicitud SOAP - Consulta de saldo:", args);
              const response = await this.walletService.checkBalance(args);

              if (!response.success) {
                return callback(null, response);
              }

              callback(null, { 
                success: true, 
                cod_error: '00', 
                message_error: 'Saldo consultado exitosamente',
                data: response.data,
              });
            } catch (error) {
              console.error('Error SOAP:', error);
              callback({
                success: false,
                cod_error: '99',
                message_error: 'Error interno del servidor',
              });
            }
          },
        },
      },
    };

    const server = http.createServer((req, res) => res.end("Servidor SOAP en ejecución"));
    soap.listen(server, '/wallet', service, wsdl);

    server.listen(process.env.PORT, () => console.log('Servidor SOAP corriendo en http://' + process.env.HOST + ':' + process.env.PORT + '/wallet?wsdl'));
  }
}