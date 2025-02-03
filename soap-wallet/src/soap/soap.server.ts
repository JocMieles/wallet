import { Injectable } from '@nestjs/common';
import * as soap from 'soap';
import * as http from 'http';
import { ClientService } from 'src/services/client.service';
import { WalletService } from 'src/services/wallet.service';
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
              // Registrar el cliente
              const clientResponse = await this.clientService.registerClient(args);
              
              if (!clientResponse.success) {
                return callback(null, clientResponse);
              }

              console.log('Cliente registrado:', clientResponse);

              // Crear la billetera para el cliente
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
                  cliente: clientResponse.data, // ✅ Solo la data relevante del cliente
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

        },
      },
    };

    const server = http.createServer((req, res) => res.end("Servidor SOAP en ejecución"));
    soap.listen(server, '/wallet', service, wsdl);

    server.listen(process.env.PORT, () => console.log('Servidor SOAP corriendo en http://localhost:' + process.env.PORT + '/wallet?wsdl'));
  }
}