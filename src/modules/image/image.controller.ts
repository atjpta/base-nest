import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  Req,
  HttpException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ImageConstant } from './constant/image.constant';
import { ImageService } from './image.service';
import { IsPublic } from '../auth/decorators/public.decorator';
import { CreateFilesArrayMongoDBDto } from 'src/base/create-dto';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';
import { QueryFindAll } from 'src/base/query-dto';
import { CreateImageDto } from './dto/create-image.dto';
import { AppConfig } from 'src/configs/app.config';

@ApiBearerAuth()
@ApiTags(ImageConstant.SWAGGER_TAG)
@Controller({ path: ImageConstant.API_PREFIX })
export class ImageController {
  constructor(private readonly _modelService: ImageService) {}

  // ========== API POST ==========
  @Post('upload')
  @ApiOperation({ summary: `Upload new ${ImageConstant.BUCKETS} to MongoDB` })
  @ApiConsumes('multipart/form-data')
  async uploadFile(
    @Req() req: Request,
    @Body() body: CreateImageDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (!req.file) {
      return BaseResponse.badRequest(ImageConstant.BUCKETS);
    }
    return BaseResponse.success({
      object: ImageConstant.BUCKETS,
      statusCode: BaseHttpStatus.OK,
      data: {
        urlImage: [
          `${AppConfig.urlServer || req.headers.host}/${
            ImageConstant.API_PREFIX
          }/${req.file.originalname}`,
        ],
        ...req.file,
        body,
      },
    });
  }

  @Post('upload/array')
  @ApiOperation({
    summary: `--- Upload many new ${ImageConstant.BUCKETS} to MongoDB ---`,
  })
  @ApiConsumes('multipart/form-data')
  async uploadFileArray(
    @Req() req: Request,
    @Body() body: CreateFilesArrayMongoDBDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (!req.files) {
      return BaseResponse.badRequest(ImageConstant.BUCKETS);
    }
    const urlImage = [];
    for (let i = 0; i < parseInt(`${req.files.length}`); i++) {
      urlImage.push(
        `${req.headers.host}/${ImageConstant.API_PREFIX}/${req.files[i].originalname}`,
      );
    }

    return BaseResponse.success({
      object: ImageConstant.BUCKETS,
      statusCode: BaseHttpStatus.OK,
      data: { urlImage, body, ...req.files },
    });
  }

  // ========== API GET ==========

  @IsPublic()
  @ApiOperation({
    summary: `--- get metadata all ${ImageConstant.BUCKETS} in MongoDB ---`,
  })
  @Get()
  async findAll(@Query() query: QueryFindAll): Promise<IHttpSuccess> {
    const records = await this._modelService.findAllInfoFile(
      query.page,
      query.limit,
    );

    return BaseResponse.success({
      object: ImageConstant.BUCKETS,
      statusCode: BaseHttpStatus.OK,
      data: records,
    });
  }

  @IsPublic()
  @ApiOperation({
    summary: `--- get ${ImageConstant.BUCKETS} in MongoDB ---`,
  })
  @Get(':filename')
  async getFilesInfo(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<IHttpSuccess> {
    const record = await this._modelService.findOneInfoFile(filename);
    if (record) {
      res.setHeader('Content-Type', 'image/jpeg');
      const recordStream = await this._modelService.downloadFileByName(
        filename,
      );
      recordStream.pipe(res);
    }
    return BaseResponse.success({
      object: ImageConstant.BUCKETS,
      statusCode: BaseHttpStatus.NO_FOUND,
    });
  }
  @IsPublic()
  @ApiOperation({
    summary: `--- download ${ImageConstant.BUCKETS} in MongoDB ---`,
  })
  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<IHttpSuccess> {
    const record = await this._modelService.findOneInfoFile(filename);
    if (record) {
      const recordStream = await this._modelService.downloadFileByName(
        filename,
      );
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      recordStream.pipe(res);
    }
    return BaseResponse.success({
      object: ImageConstant.BUCKETS,
      statusCode: BaseHttpStatus.NO_FOUND,
    });
  }

  // ========== API PUT ==========

  // ========== API DELETE ==========

  @ApiOperation({
    summary: `--- delete Duplicate download ${ImageConstant.BUCKETS} in MongoDB ---`,
  })
  @Delete()
  async deleteDuplicate(): Promise<IHttpSuccess> {
    const data = await this._modelService.deleteDuplicate();
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ImageConstant.BUCKETS,
      data,
    });
  }

  @ApiOperation({
    summary: `--- delete ${ImageConstant.BUCKETS} in MongoDB ---`,
  })
  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string): Promise<IHttpSuccess> {
    const data = await this._modelService.DeleteOne(filename);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ImageConstant.BUCKETS,
      data,
    });
  }
}
