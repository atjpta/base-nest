import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ViewDetailService } from './view-detail.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';
import { CreateViewDetailDto } from './dto/create-view-detail.dto';
import { ViewDetailConstant } from './constant/view-detail.constant';
import { IsPublic } from '../auth/decorators/public.decorator';
import {
  QueryByMonthAndMusicDto,
  QueryByYearAndMusicDto,
  QueryTopByDateDto,
} from './dto/query-view-detail.dto';
@ApiBearerAuth()
@ApiTags(ViewDetailConstant.SWAGGER_TAG)
@Controller({ path: ViewDetailConstant.API_PREFIX })
export class ViewDetailController {
  constructor(private readonly _modelService: ViewDetailService) {}

  // ========== API POST ==========

  @IsPublic()
  @Post(``)
  @ApiOperation({
    summary: `--- Create ${ViewDetailConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Body() body: CreateViewDetailDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.createOrUpdate(body.music);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ViewDetailConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @IsPublic()
  @Get(`top`)
  @ApiOperation({
    summary: `--- get top ${ViewDetailConstant.MODEL_NAME} by day ---`,
  })
  public async getTopByDay(
    @Query() query: QueryTopByDateDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.getTopByDate(query);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ViewDetailConstant.MODEL_NAME,
      data: records,
    });
  }

  @IsPublic()
  @Get(`month`)
  @ApiOperation({
    summary: `--- get top ${ViewDetailConstant.MODEL_NAME} in month ---`,
  })
  public async getByMonthAndMusic(
    @Query() query: QueryByMonthAndMusicDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.getByMonthAndMusic(query);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ViewDetailConstant.MODEL_NAME,
      data: records,
    });
  }

  @IsPublic()
  @Get(`year`)
  @ApiOperation({
    summary: `--- get ${ViewDetailConstant.MODEL_NAME} in yean ---`,
  })
  public async getByYearAndMusic(
    @Query() query: QueryByYearAndMusicDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.getByYearAndMusic(query);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ViewDetailConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API PUT ==========

  // ========== API DELETE ==========
}
