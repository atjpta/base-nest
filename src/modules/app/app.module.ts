import { Module } from '@nestjs/common';
import { join } from 'path';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config/dist';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTERS, APP_GUARDS, APP_MODULES } from '../';
import { BullModule } from '@nestjs/bull';
import { AppConfig } from 'src/configs/app.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../../public'),
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env', '.development.env'], // https://docs.nestjs.com/techniques/configuration
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: AppConfig.getInstance().redis.host,
          port: AppConfig.getInstance().redis.port,
          password: AppConfig.getInstance().redis.password,
        },
      }),
    }),
    ...APP_MODULES,
  ],
  controllers: [AppController],
  providers: [
    ...APP_FILTERS.map((filter) => ({
      provide: APP_FILTER,
      useClass: filter,
    })),
    ...APP_GUARDS.map((guard) => ({
      provide: APP_GUARD,
      useClass: guard,
    })),
    AppService,
  ],
})
export class AppModule {
  constructor(private readonly _appService: AppService) {}
}
