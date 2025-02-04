# README - SOAP Wallet

## Descripción
Este servicio expone una API **SOAP** para gestionar transacciones y cuentas en la billetera virtual. Se conecta directamente con MongoDB.

## Instalación
Si no usas Docker, instala las dependencias y ejecuta:
```sh
npm install
npm run start
```

## Configuración de Entorno (`.env`)
```env
MONGO_URI=mongodb://localhost:27017/soap_wallet
PORT=4000
HOST=localhost
USER_GMAIL=pruebaspruebasmieles@gmail.com
PASS=pruebasmieles1234
CLIENT_ID=''
CLIENT_SECRET=''
REFRESH_TOKEN=''
```

## Endpoints SOAP
- `http://localhost:4000/wallet?wsdl`

### **Servicios Disponibles**
- **registerClient**: Registra un cliente y crea su billetera.
- **rechargeWallet**: Recarga saldo en una billetera.
- **pay**: Inicia un pago y devuelve un código de confirmación.
- **confirmPayment**: Confirma un pago con el código de verificación.
- **checkBalance**: Consulta el saldo de una billetera.

## Mejoras Futuras
- Validar que los datos enviados sean correctos antes de crear una billetera.
- Mejorar seguridad en las transacciones.