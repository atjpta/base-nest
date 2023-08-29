import { Module, Global } from '@nestjs/common';

import { BullModule } from '@nestjs/bull';
import { AppConfig } from 'src/configs/app.config';
import { BULL_CONSUMER } from './consumers';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: AppConfig.getInstance().redis.host,
          port: AppConfig.getInstance().redis.port,
          password: AppConfig.getInstance().redis.password,
        },
      }),
    }),
  ],
  providers: [...BULL_CONSUMER],
  exports: [...BULL_CONSUMER],
})
export class BullRedisModule {}
