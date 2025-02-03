import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthService } from './services/auth.service';

import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthController } from './controllers/auth.controller';
import { ClientController } from './controllers/client.controller';
import { SoapService } from './services/soap.service';

@Module({
  imports: [],
  controllers: [AuthController, ClientController],
  providers: [AuthService, SoapService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth/generateToken', method: RequestMethod.GET }) // Excluir endpoint de generación de token
      .forRoutes(ClientController);
  }
}