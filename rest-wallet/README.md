
# README - REST Wallet

## Descripción
Este servicio REST se comunica con **SOAP** y expone endpoints accesibles vía HTTP.

## Instalación
Si no usas Docker, instala las dependencias y ejecuta:
```sh
npm install
npm run start
```

## Configuración de Entorno (`.env`)
```env
SOAP_URL=http://localhost:4000/wallet?wsdl
PORT=3000
JWT_SECRET_KEY=e8d5f0b7c72c3a1ad5b6a0fdb765e83a295fdb53e3a229d7e7e2e2c89b17b9aa
HOST=localhost
```

## Endpoints REST
- `POST /wallet/recharge`: Recarga saldo en la billetera (llama a `rechargeWallet` en SOAP).
- `POST /wallet/pay`: Inicia un pago (llama a `pay` en SOAP).
- `POST /wallet/confirm`: Confirma un pago (llama a `confirmPayment` en SOAP).
- `GET /wallet/balance`: Consulta el saldo de una billetera (llama a `checkBalance` en SOAP).
- `POST /clients/register`: Registra un nuevo cliente en la plataforma (llama a `registerClient` en SOAP).
- `GET /auth/generateToken`: Genera un token de autenticación.

## Mejoras Futuras
- Implementar autenticación con JWT para proteger los endpoints.
- Validación de correos electrónicos.
- Soporte para diferentes tipos de transacciones.