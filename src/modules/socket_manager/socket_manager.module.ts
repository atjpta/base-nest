import { Module } from '@nestjs/common';
import { SocketManagerService } from './socket_manager.service';
import { SocketManagerGateway } from './socket_manager.gateway';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from 'src/configs/app.config';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [],
      useFactory: async () => {
        const authConfig = AppConfig.getInstance().auth;
        const accessTokenKey = authConfig.accessTokenSecretKey;
        const accessTokenExpirationTime = authConfig.accessTokenExpirationTime;

        return {
          secret: accessTokenKey,
          signOptions: {
            expiresIn: accessTokenExpirationTime,
          },
        };
      },
      inject: [],
    }),
  ],
  providers: [SocketManagerGateway, SocketManagerService],
  exports: [SocketManagerService],
})
export class SocketManagerModule {}
