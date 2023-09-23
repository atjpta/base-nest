import { Controller } from '@nestjs/common';
import { CacheRedisService } from './cache-redis.service';
import { CacheRedisConstant } from './constant/cache-redis.constant';

@Controller({ path: CacheRedisConstant.API_PREFIX })
export class CacheRedisController {
  constructor(private readonly cacheRedisService: CacheRedisService) {}
}
