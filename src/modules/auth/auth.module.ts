import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
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
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, UserModule],
})
export class AuthModule {}
