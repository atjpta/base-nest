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
import { ArtistConstant } from './constant/artist.constant';
import { ArtistService } from './artist.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { CreateArtistDto } from './dto/create-artist.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { AppConfig } from 'src/configs/app.config';
import { ImageConstant } from '../image/constant/image.constant';
import { Request } from 'express';
import { QuerySearchArtistDto } from './dto/query-artist.dto';
@HasRoles(RoleConstant.LIST_ROLES.Admin)
@ApiBearerAuth()
@ApiTags(ArtistConstant.SWAGGER_TAG)
@Controller({ path: ArtistConstant.API_PREFIX })
export class ArtistController {
  constructor(private readonly _modelService: ArtistService) {}

  // ========== API POST ==========

  @Post(``)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- Create ${ArtistConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Req() req: Request,
    @Body() body: CreateArtistDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.avatar = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }

    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ArtistConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @Get()
  @ApiOperation({
    summary: `--- find all ${ArtistConstant.MODEL_NAME}  ---`,
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
      object: ArtistConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  // ========== API PUT ==========

  @Put(`:id`)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- update ${ArtistConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Req() req: Request,
    @Body() body: UpdateArtistDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.avatar = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }

    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ArtistConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${ArtistConstant.MODEL_NAME}  by id ---`,
  })
  public async delete(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ArtistConstant.MODEL_NAME,
      data: records,
    });
  }
}
