import { RedisStore, redisStore } from 'cache-manager-redis-store';
import { Global, Module } from '@nestjs/common';
import { CacheRedisService } from './cache-redis.service';
import { CacheRedisController } from './cache-redis.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { AppConfig } from 'src/configs/app.config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      useFactory: async () => {
        let store: RedisStore;
        try {
          store = await redisStore({
            socket: {
              host: AppConfig.getInstance().redis.host,
              port: AppConfig.getInstance().redis.port,
            },
            database: AppConfig.getInstance().redis.db,
            ttl: AppConfig.getInstance().redis.ttl,
            password: AppConfig.getInstance().redis.password,
          });
          console.log(`Connected to redis!`);
        } catch (error) {
          console.log(`Connected to cache!`);
        }
        if (store) {
          return {
            store: store,
            isGlobal: true,
          };
        } else {
          return {
            ttl: AppConfig.getInstance().redis.ttl * 1000,
            isGlobal: true,
          };
        }
      },
    }),
  ],
  controllers: [CacheRedisController],
  providers: [
    CacheRedisService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CacheInterceptor, // auto cache response
    // },
  ],
  exports: [CacheModule, CacheRedisService],
})
export class CacheRedisModule {}
