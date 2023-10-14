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
import { PlaylistService } from './playlist.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { AppConfig } from 'src/configs/app.config';
import { ImageConstant } from '../image/constant/image.constant';
import { Request } from 'express';
import { QuerySearchArtistDto } from '../artist/dto/query-artist.dto';
import { IsPublic } from '../auth/decorators/public.decorator';
import { PlaylistConstant } from './constant/playlist.constant';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import {
  UpdateMusicPlaylistDto,
  UpdatePlaylistDto,
} from './dto/update-playlist.dto';
import { GetUserId } from '../auth/decorators/user.decorator';
@ApiBearerAuth()
@ApiTags(PlaylistConstant.SWAGGER_TAG)
@Controller({ path: PlaylistConstant.API_PREFIX })
export class PlaylistController {
  constructor(private readonly _modelService: PlaylistService) {}

  // ========== API POST ==========

  @Post(``)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- Create ${PlaylistConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Req() req: Request,
    @Body() body: CreatePlaylistDto,
    @GetUserId() id: string,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.url_image = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }
    body['createdBy'] = id;

    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PlaylistConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========
  @IsPublic()
  @Get()
  @ApiOperation({
    summary: `--- find all ${PlaylistConstant.MODEL_NAME}  ---`,
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
      object: PlaylistConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  @IsPublic()
  @Get(':id')
  @ApiOperation({
    summary: `--- find one ${PlaylistConstant.MODEL_NAME} by id ---`,
  })
  public async findOne(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findOne(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PlaylistConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API PUT ==========

  @Put(`:id`)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- update ${PlaylistConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Req() req: Request,
    @Body() body: UpdatePlaylistDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.url_image = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }

    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PlaylistConstant.MODEL_NAME,
      data: records,
    });
  }

  @Put(`add-music/:id`)
  @ApiOperation({
    summary: `--- add music ${PlaylistConstant.MODEL_NAME} by id ---`,
  })
  public async addMusic(
    @Param('id', ValidateMongoId) id: string,
    @Body() body: UpdateMusicPlaylistDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.addMusic(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PlaylistConstant.MODEL_NAME,
      data: records,
    });
  }

  @Put(`remove-music/:id`)
  @ApiOperation({
    summary: `--- remove music ${PlaylistConstant.MODEL_NAME} by id ---`,
  })
  public async removeMusic(
    @Param('id', ValidateMongoId) id: string,
    @Body() body: UpdateMusicPlaylistDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeMusic(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PlaylistConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${PlaylistConstant.MODEL_NAME}  by id ---`,
  })
  public async delete(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PlaylistConstant.MODEL_NAME,
      data: records,
    });
  }
}
