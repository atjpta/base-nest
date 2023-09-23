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
import { CountryConstant } from './constant/country.constant';
import { CountryService } from './country.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { CreateCountryDto } from './dto/create-country.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { AppConfig } from 'src/configs/app.config';
import { ImageConstant } from '../image/constant/image.constant';
import { Request } from 'express';
import { QuerySearchArtistDto } from '../artist/dto/query-artist.dto';
@HasRoles(RoleConstant.LIST_ROLES.Admin)
@ApiBearerAuth()
@ApiTags(CountryConstant.SWAGGER_TAG)
@Controller({ path: CountryConstant.API_PREFIX })
export class CountryController {
  constructor(private readonly _modelService: CountryService) {}

  // ========== API POST ==========

  @Post(``)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- Create ${CountryConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Req() req: Request,
    @Body() body: CreateCountryDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.avatar = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }

    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: CountryConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @Get()
  @ApiOperation({
    summary: `--- find all ${CountryConstant.MODEL_NAME}  ---`,
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
      object: CountryConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  // ========== API PUT ==========

  @Put(`:id`)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- update ${CountryConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Req() req: Request,
    @Body() body: UpdateCountryDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.avatar = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }

    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: CountryConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${CountryConstant.MODEL_NAME}  by id ---`,
  })
  public async delete(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: CountryConstant.MODEL_NAME,
      data: records,
    });
  }
}
