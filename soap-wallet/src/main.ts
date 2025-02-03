import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SoapServer } from './soap/soap.server';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const soapServer = app.get(SoapServer);
  await soapServer.startServer();
}

bootstrap();