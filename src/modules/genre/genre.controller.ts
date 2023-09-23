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
import { GenreConstant } from './constant/genre.constant';
import { GenreService } from './genre.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { CreateGenreDto } from './dto/create-genre.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { AppConfig } from 'src/configs/app.config';
import { ImageConstant } from '../image/constant/image.constant';
import { Request } from 'express';
import { QuerySearchArtistDto } from '../artist/dto/query-artist.dto';
@HasRoles(RoleConstant.LIST_ROLES.Admin)
@ApiBearerAuth()
@ApiTags(GenreConstant.SWAGGER_TAG)
@Controller({ path: GenreConstant.API_PREFIX })
export class GenreController {
  constructor(private readonly _modelService: GenreService) {}

  // ========== API POST ==========

  @Post(``)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- Create ${GenreConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Req() req: Request,
    @Body() body: CreateGenreDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.avatar = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }

    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: GenreConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @Get()
  @ApiOperation({
    summary: `--- find all ${GenreConstant.MODEL_NAME}  ---`,
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
      object: GenreConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  // ========== API PUT ==========

  @Put(`:id`)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: `--- update ${GenreConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Req() req: Request,
    @Body() body: UpdateGenreDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.avatar = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }

    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: GenreConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${GenreConstant.MODEL_NAME}  by id ---`,
  })
  public async delete(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: GenreConstant.MODEL_NAME,
      data: records,
    });
  }
}
