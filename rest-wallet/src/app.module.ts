import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthController } from './controllers/auth.controller';
import { ClientController } from './controllers/client.controller';
import { SoapService } from './services/soap.service';
import { WalletController } from './controllers/wallet.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AuthController, ClientController, WalletController],
  providers: [AuthService, SoapService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth/generateToken', method: RequestMethod.GET })
      .forRoutes(ClientController, WalletController);
  }
}