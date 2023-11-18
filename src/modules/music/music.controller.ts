import { SongService } from './../song/song.service';
import { IsPublic } from './../auth/decorators/public.decorator';
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
  ParseIntPipe,
  Res,
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
import { Request, Response } from 'express';
import { QuerySearchArtistDto } from '../artist/dto/query-artist.dto';
import { AppConfig } from 'src/configs/app.config';
import { ImageConstant } from '../image/constant/image.constant';
import { SongConstant } from '../song/constant/song.constant';
import { GetUserId } from '../auth/decorators/user.decorator';

@ApiBearerAuth()
@ApiTags(MusicConstant.SWAGGER_TAG)
@Controller({ path: MusicConstant.API_PREFIX })
export class MusicController {
  constructor(
    private readonly _modelService: MusicService,
    private songService: SongService,
  ) {}

  // ========== API POST ==========

  @Post(``)
  @HasRoles(RoleConstant.LIST_ROLES.Admin)
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
          body.name_origin = req.files[i].originalname;
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

  @IsPublic()
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

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Get('total')
  @ApiOperation({
    summary: `--- find total ${MusicConstant.MODEL_NAME}  ---`,
  })
  public async findTotal(): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.getTotalRow();

    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: MusicConstant.MODEL_NAME,
      data: { total: records },
    });
  }

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Get('total-view')
  @ApiOperation({
    summary: `--- find total ${MusicConstant.MODEL_NAME}  ---`,
  })
  public async findTotalView(): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.getTotalView();

    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: MusicConstant.MODEL_NAME,
      data: { total: records },
    });
  }

  @IsPublic()
  @Get('model/:type/:id')
  @ApiOperation({
    summary: `--- find all ${MusicConstant.MODEL_NAME} by model type + id ---`,
  })
  public async findAllByModel(
    @Query() query: QuerySearchArtistDto,
    @Param('id') id: string,
    @Param('type') type: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAllByModel(
      type,
      id,
      query.page,
      query.limit,
    );
    const total = await this._modelService.findAllByModelCount(type, id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: MusicConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  @IsPublic()
  @Get('random/:id')
  @ApiOperation({
    summary: `--- find random ${MusicConstant.MODEL_NAME}  ---`,
  })
  public async findRandom(
    @Param('id', ValidateMongoId) id: string,
    @Query('size', ParseIntPipe) size: number = 10,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.getRandom(id, size);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: MusicConstant.MODEL_NAME,
      data: records,
    });
  }

  @IsPublic()
  @Get('download/:id')
  @ApiOperation({
    summary: `--- down load one ${MusicConstant.MODEL_NAME}  ---`,
  })
  public async downOne(
    @Param('id', ValidateMongoId) id: string,
    @Res() res: Response,
  ) {
    const music = await this._modelService.findOneById(id);

    const record = await this.songService.findOneInfoFile(music.name_origin);
    const extension = music.name_origin.split('.')[1];
    if (record) {
      const recordStream = await this.songService.downloadFileByName(
        music.name_origin,
      );

      const safeFileName = encodeURIComponent(music.name);
      const safeExtension = encodeURIComponent(extension);

      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${safeFileName}.${safeExtension}`,
      );
      return recordStream.pipe(res);
    }
    return BaseResponse.success({
      object: SongConstant.BUCKETS,
      statusCode: BaseHttpStatus.NO_FOUND,
    });
  }

  // ========== API PUT ==========

  @Put(`:id`)
  @HasRoles(RoleConstant.LIST_ROLES.Admin)
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
  @HasRoles(RoleConstant.LIST_ROLES.Admin)
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
