import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AppConfig } from 'src/configs/app.config';
import { BullModule } from '@nestjs/bull';
import { BullConstant } from '../bull/constant/bull.constant';
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
    BullModule.registerQueue({
      name: BullConstant.JOB_BULL.sendEmail,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, BullModule],
  exports: [AuthService, UserModule],
})
export class AuthModule {}
