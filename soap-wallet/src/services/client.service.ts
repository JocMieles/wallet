import { Injectable } from '@nestjs/common';
import { ClientRepository } from '../repositories/client.repository';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async registerClient(data: { document: string; name: string; email: string; phone: string }) {
    if (!data.document || !data.name || !data.email || !data.phone) {
      return {
        success: false,
        cod_error: '01',
        message_error: 'Todos los campos son obligatorios',
      };
    }

    const existingClientByDocument = await this.clientRepository.findByDocument(data.document);
    if (existingClientByDocument) {
      return {
        success: false,
        cod_error: '01',
        message_error: 'El documento ya está registrado',
      };
    }

    const existingClientByPhone = await this.clientRepository.findByPhone(data.phone);
    if (existingClientByPhone) {
      return {
        success: false,
        cod_error: '03',
        message_error: 'El número de teléfono ya está registrado',
      };
    }

    const existingClientByEmail = await this.clientRepository.findByEmail(data.email);
    if (existingClientByEmail) {
      return {
        success: false,
        cod_error: '04',
        message_error: 'El correo electrónico ya está registrado',
      };
    }

    const savedClient = await this.clientRepository.create(data);

    const clientData = {
      document: savedClient.document,
      name: savedClient.name,
      email: savedClient.email,
      phone: savedClient.phone,
    };

    return {
      success: true,
      cod_error: '00',
      clientId : savedClient?.id?.toString(),
      message_error: 'Cliente registrado exitosamente',
      data: clientData,
    };
  }
}