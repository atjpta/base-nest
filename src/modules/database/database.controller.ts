import { IsPublic } from './../auth/decorators/public.decorator';
import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { DatabasesConstant } from './constant/database.constant';
import { DatabaseService } from './database.service';
import { BaseHttpStatus } from 'src/base/http-status';
import { IHttpSuccess, BaseResponse } from 'src/base/response';

@IsPublic()
@ApiTags(DatabasesConstant.SWAGGER_TAG)
@Controller({ path: DatabasesConstant.API_PREFIX })
export class DatabaseController {
  constructor(private readonly _modelService: DatabaseService) {}

  // ========== API POST ==========

  @Post()
  @ApiOperation({ summary: `--- init database ---` })
  public async initDatabase(): Promise<IHttpSuccess | HttpException> {
    const db = await this._modelService.initDataBase();
    return BaseResponse.success({
      statusCode: BaseHttpStatus.CREATED,
      object: 'database',
      data: db,
      message: `init [database] success`,
    });
  }

  @Delete()
  @ApiOperation({ summary: `--- Delete database ---` })
  public async deleteDatabase(): Promise<IHttpSuccess | HttpException> {
    const resData = await this._modelService.dropDatabase();
    return BaseResponse.success({
      statusCode: BaseHttpStatus.DELETE,
      object: 'database',
      message: `delete [database] success`,
      data: resData,
    });
  }

  // ========== API GET ==========

  @Get()
  @ApiOperation({
    summary: '--- Get all name of collection ---',
  })
  public async getCollections() {
    const collections = await this._modelService.getCollections();
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: 'collection',
      data: collections,
    });
  }

  // ========== API GET ==========

  // ========== API DELETE ==========

  @ApiParam({
    name: 'collectionName',
    enum: Object.values(DatabasesConstant.COLLECTIONS_NAME),
  })
  @Delete(`:collectionName`)
  @ApiOperation({
    summary: `--- Delete collection by name ---`,
  })
  public async dropCollection(@Param('collectionName') collectionName: string) {
    const resData = await this._modelService.dropCollection(collectionName);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.DELETE,
      data: resData,
      object: 'collection',
      message: `delete [${collectionName}] success`,
    });
  }
}
