import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheRedisService {
  constructor(@Inject(CACHE_MANAGER) public readonly cacheManager: Cache) {}
  public async get(key: string) {
    const value = await this.cacheManager.store.get(key);
    return value;
  }

  public async set(key: string, value: string) {
    await this.cacheManager.set(key, value);
    return true;
  }
}
