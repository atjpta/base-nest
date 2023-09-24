import { AppMixin } from 'src/shared/utils/app-mixin';
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
import { MusicConstant } from './constant/music.constant';
import { MusicService } from './music.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { CreateMusicDto } from './dto/create-music.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { UpdateMusicDto } from './dto/update-music.dto';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { Request } from 'express';
import { QuerySearchArtistDto } from '../artist/dto/query-artist.dto';
import { AppConfig } from 'src/configs/app.config';
import { ImageConstant } from '../image/constant/image.constant';
import { SongConstant } from '../song/constant/song.constant';
import { GetUserId } from '../auth/decorators/user.decorator';
@HasRoles(RoleConstant.LIST_ROLES.Admin)
@ApiBearerAuth()
@ApiTags(MusicConstant.SWAGGER_TAG)
@Controller({ path: MusicConstant.API_PREFIX })
export class MusicController {
  constructor(private readonly _modelService: MusicService) {}

  // ========== API POST ==========

  @Post(``)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- Create ${MusicConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Req() req: Request,
    @GetUserId() id: string,
    @Body() body: CreateMusicDto,
  ): Promise<IHttpSuccess | HttpException> {
    body.singer = AppMixin.parseArray(body.singer);
    body.genre = AppMixin.parseArray(body.genre);
    body.country = AppMixin.parseArray(body.country);

    if (req.files) {
      const length = req.files.length as number;
      for (let i = 0; i < length; i++) {
        if (req.files[i].mimetype.split('/')[0] == 'image') {
          body.url_image = `${AppConfig.urlServer || ImageConstant.URL_API}/${
            ImageConstant.API_PREFIX
          }/${req.files[i].originalname}`;
        } else {
          body.url = `${AppConfig.urlServer || SongConstant.URL_API}/${
            SongConstant.API_PREFIX
          }/${req.files[i].originalname}`;
        }
      }
    }

    body['createdBy'] = id;

    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: MusicConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @Get()
  @ApiOperation({
    summary: `--- find all ${MusicConstant.MODEL_NAME}  ---`,
  })
  public async findAll(
    @Query() query: QuerySearchArtistDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAllSearchDefault(
      query.key,
      query.page,
      query.limit,
      `country genre singer`,
    );
    const total = await this._modelService.findAllSearchCountDefault(query.key);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: MusicConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  // ========== API PUT ==========

  @Put(`:id`)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- update ${MusicConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Req() req: Request,
    @Body() body: UpdateMusicDto,
  ): Promise<IHttpSuccess | HttpException> {
    body.singer = AppMixin.parseArray(body.singer);
    body.genre = AppMixin.parseArray(body.genre);
    body.country = AppMixin.parseArray(body.country);

    if (req.files) {
      const length = req.files.length as number;
      for (let i = 0; i < length; i++) {
        if (req.files[i].mimetype.split('/')[0] == 'image') {
          body.url_image = `${AppConfig.urlServer || ImageConstant.URL_API}/${
            ImageConstant.API_PREFIX
          }/${req.files[i].originalname}`;
        } else {
          body.url = `${AppConfig.urlServer || SongConstant.URL_API}/${
            SongConstant.API_PREFIX
          }/${req.files[i].originalname}`;
        }
      }
    }

    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: MusicConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${MusicConstant.MODEL_NAME}  by id ---`,
  })
  public async delete(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: MusicConstant.MODEL_NAME,
      data: records,
    });
  }
}
