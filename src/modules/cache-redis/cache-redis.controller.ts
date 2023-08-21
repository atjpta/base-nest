import { Controller, Get, Query } from '@nestjs/common';
import { CacheRedisService } from './cache-redis.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CacheRedisConstant } from './constant/cache-redis.constant';

@ApiBearerAuth()
@ApiTags(CacheRedisConstant.SWAGGER_TAG)
@Controller({ path: CacheRedisConstant.API_PREFIX })
export class CacheRedisController {
  constructor(private readonly cacheRedisService: CacheRedisService) {}

  @Get('set')
  @ApiOperation({ summary: `set  ${CacheRedisConstant.SWAGGER_TAG}` })
  public async setRedis(
    @Query('key') key: string,
    @Query('value') value: string,
  ) {
    await this.cacheRedisService.set(key, value);
    return { key, value };
  }

  @Get('get')
  @ApiOperation({ summary: `get  ${CacheRedisConstant.SWAGGER_TAG}` })
  public async getRedis(@Query('key') key: string) {
    const value = await this.cacheRedisService.get(key);
    return { value };
  }
}
