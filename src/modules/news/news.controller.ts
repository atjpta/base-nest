import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { NewsConstant } from './constant/news.constant';
import { NewsService } from './news.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { CreateNewsDto } from './dto/create-news.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { UpdateNewsDto } from './dto/update-news.dto';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { AppConfig } from 'src/configs/app.config';
import { ImageConstant } from '../image/constant/image.constant';
import { Request } from 'express';
import { QuerySearchArtistDto } from '../artist/dto/query-artist.dto';
import { IsPublic } from '../auth/decorators/public.decorator';
@ApiBearerAuth()
@ApiTags(NewsConstant.SWAGGER_TAG)
@Controller({ path: NewsConstant.API_PREFIX })
export class NewsController {
  constructor(private readonly _modelService: NewsService) {}

  // ========== API POST ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Post(``)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- Create ${NewsConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Req() req: Request,
    @Body() body: CreateNewsDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.image = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }

    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NewsConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========
  @IsPublic()
  @Get()
  @ApiOperation({
    summary: `--- find all ${NewsConstant.MODEL_NAME}  ---`,
  })
  public async findAll(
    @Query() query: QuerySearchArtistDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAllSearchDefault(
      query.key,
      query.page,
      query.limit,
    );
    const total = await this._modelService.findAllSearchCountDefault(query.key);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NewsConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  // ========== API PUT ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Put(`:id`)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- update ${NewsConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Req() req: Request,
    @Body() body: UpdateNewsDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.image = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }

    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NewsConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @Delete(`:id`)
  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @ApiOperation({
    summary: `--- Delete ${NewsConstant.MODEL_NAME}  by id ---`,
  })
  public async delete(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NewsConstant.MODEL_NAME,
      data: records,
    });
  }
}
