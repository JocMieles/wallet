import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { ClientRepository } from 'src/repositories/client.repository';
import { WalletRepository } from 'src/repositories/wallet.repository';
const nodemailer = require('nodemailer');

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository, private readonly clientRepository: ClientRepository
  ) { }

  async createWallet(data: { clienteId: string; amount: number }) {
    const existingWallet = await this.walletRepository.findByDocument(data.clienteId);
    if (existingWallet) {
      return { success: false, cod_error: '01', message_error: 'La billetera ya existe' };
    }

    const wallet = await this.walletRepository.create(data.clienteId);
    return {
      success: true,
      cod_error: '00',
      message_error: 'Billetera creada exitosamente',
      data: {
        clienteId: wallet.clientId,
        saldo: wallet.balance,
      }
    };
  }

  async rechargeWallet(data: { document: string; phone: string; amount: number }) {
    const client = await this.clientRepository.findByDocument(data.document);
    console.log('Cliente encontrado:', client);

    if (!client || client.phone !== data.phone) {
      return { success: false, cod_error: '02', message_error: 'Cliente no encontrado o el teléfono no coincide' };
    }

    const wallet = await this.walletRepository.updateBalance(client.id, data.amount);
    console.log('Billetera actualizada:', wallet);

    return {
      success: true,
      cod_error: '00',
      message_error: 'Billetera recargada exitosamente',
      data: {
        saldo: wallet?.balance
      }
    };
  }

  async pay(data: { document: string; phone: string; amount: number }) {
    const client = await this.clientRepository.findByDocumentAndPhone(data.document, data.phone);

    if (!client || client.phone !== data.phone) {
      return { success: false, cod_error: '02', message_error: 'Cliente no encontrado, el teléfono o el documento no coincide' };
    }

    const wallet = await this.walletRepository.findByClientId(client.id);

    if (!wallet || wallet.balance < data.amount) {
      return { success: false, cod_error: '03', message_error: 'Saldo insuficiente' };
    }

    const token = randomInt(100000, 999999);
    const session_id = `${Date.now()}-${client._id}`;

    this.clientRepository.updateValidationCode(client.id, token.toString(), session_id, data.amount);

    console.log(process.env.USER_GMAIL)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.USER_GMAIL,
        pass: process.env.PASS,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN
      }
    });

    const mailOptions = {
      from: process.env.USER,
      to: client.email,
      subject: 'Código de pago para confirmar compra.',
      text: 'El token para su confirmación de compra es: ' + token
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Correo enviado: ' + info.response);
      }
    });

    return {
      success: true,
      cod_error: '00',
      message_error: 'Codigo de session_id',
      data: { session_id }
    };
  }

  async confirmPayment(data: { session_id: string; token: number }) {
    // Simulamos la validación del token (debería guardarse en la BD)
    const cliente = await this.clientRepository.findBySessionId(data.session_id);

    if (!cliente) {
      return { success: false, cod_error: '01', message_error: 'Sesión no encontrada' };
    }
    console.log('Cliente encontrado:', cliente);
    // Simulamos la deducción del saldo (se debería aplicar en la billetera)
    if (+cliente?.token !== +data.token) {
      return { success: false, cod_error: '02', message_error: 'Token incorrecto' };
    }

    await this.walletRepository.updateBalance(cliente.id, -cliente.amount);

    await this.clientRepository.updateValidationCode(cliente.id, "", "", 0);

    return {
      success: true,
      cod_error: '00',
      message_error: 'Pago confirmado',
      data: { session_id: data.session_id, estado: 'Pago realizado' }
    };
  }

}