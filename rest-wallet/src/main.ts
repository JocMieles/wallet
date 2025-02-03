import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilitar CORS por si se consume desde otro frontend
  await app.listen(3000);
  console.log('REST API corriendo en http://localhost:'+process.env.PORT);
}
bootstrap();