# README - Billetera Virtual

## Descripción
Este proyecto es una billetera virtual implementada con Node.js y NestJS, que expone servicios **SOAP y REST**. Permite gestionar cuentas y transacciones de manera segura y escalable, enviando un email al correo registrado al crear un cliente, el correo debe existir.

El **servicio REST** llama al **servicio SOAP**, y el **servicio SOAP** se conecta directamente a la base de datos MongoDB para gestionar las operaciones.

## Tecnologías Utilizadas
- **Node.js** con **NestJS**
- **MongoDB**
- **Docker** para contenerización
- **SOAP** y **REST** APIs
- **JWT** para autenticación por Headers (pendiente de implementación en mejoras futuras)

## Instalación y Ejecución

### 1. **Ejecutar con Docker** (Recomendado)
Asegúrate de tener **Docker y Docker Compose** instalados.
```sh
docker-compose up --build -d
```
Esto iniciará MongoDB, el servicio SOAP y el servicio REST automáticamente.

### 2. **Ejecución manual** (Sin Docker)
#### **Requisitos Previos**
- Node.js instalado (v16+ recomendado)
- MongoDB en ejecución localmente en `mongodb://localhost:27017`

#### **Pasos**
```sh
git clone https://github.com/tu-repo/wallet.git
cd wallet
```
Instalar dependencias en cada servicio:
```sh
cd soap-wallet && npm install
cd ../rest-wallet && npm install
```
Ejecutar cada servicio:
```sh
cd soap-wallet && npm run start
cd ../rest-wallet && npm run start
```

## Endpoints Principales
- **SOAP**: `http://localhost:4000/wallet?wsdl`
- **REST**: `http://localhost:3000`

Para más detalles, consulta los README específicos de cada servicio.

## Mejoras Futuras
1. **Autenticación con JWT**: Implementar login con usuario y contraseña, generando tokens JWT.
2. **Validación de Email**: Verificar si el correo ingresado existe antes de registrar usuarios.
3. **Historial de Transacciones**: Collections para guardar transacciones y Endpoint para listar transacciones de una billetera.
4. **Rate Limiting y Seguridad**: Evitar abuso de los endpoints con limitación de peticiones.
