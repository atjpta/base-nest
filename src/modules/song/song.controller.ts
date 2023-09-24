import { Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SongConstant } from './constant/song.constant';
import { SongService } from './song.service';
import { IsPublic } from '../auth/decorators/public.decorator';
import {
  CreateFileMongoDBDto,
  CreateFilesArrayMongoDBDto,
} from 'src/base/create-dto';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';

@ApiBearerAuth()
@ApiTags(SongConstant.SWAGGER_TAG)
@Controller({ path: SongConstant.API_PREFIX })
export class SongController {
  constructor(private readonly _modelService: SongService) {}

  // ========== API POST ==========

  @Post('upload')
  @ApiOperation({
    summary: `--- Upload new ${SongConstant.BUCKETS} to MongoDB ---`,
  })
  @ApiConsumes('multipart/form-data')
  async uploadFile(@Body() body: CreateFileMongoDBDto): Promise<IHttpSuccess> {
    body;
    return BaseResponse.success({
      object: SongConstant.BUCKETS,
      statusCode: BaseHttpStatus.OK,
      data: 1,
    });
  }

  @Post('upload/array')
  @ApiOperation({
    summary: `--- Upload many new ${SongConstant.BUCKETS} to MongoDB ---`,
  })
  @ApiConsumes('multipart/form-data')
  async uploadFileArray(
    @Body() body: CreateFilesArrayMongoDBDto,
  ): Promise<IHttpSuccess> {
    body;
    return BaseResponse.success({
      object: SongConstant.BUCKETS,
      statusCode: BaseHttpStatus.OK,
      data: 1,
    });
  }

  // ========== API GET ==========

  @IsPublic()
  @Get(':filename')
  @ApiOperation({ summary: `--- get ${SongConstant.BUCKETS} in MongoDB ---` })
  async getFilesInfo(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<IHttpSuccess> {
    await this._modelService.downloadFileByName(filename);

    const record = await this._modelService.findOneInfoFile(filename);

    if (record) {
      const recordStream = await this._modelService.downloadFileByName(
        filename,
      );
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Content-Length', record.length);
      res.setHeader('Content-Range', 'bytes');
      recordStream.pipe(res);
    }
    return BaseResponse.success({
      object: SongConstant.BUCKETS,
      statusCode: BaseHttpStatus.NO_FOUND,
    });
  }

  @IsPublic()
  @Get('download/:filename')
  @ApiOperation({
    summary: `--- download ${SongConstant.BUCKETS} in MongoDB ---`,
  })
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
      object: SongConstant.BUCKETS,
      statusCode: BaseHttpStatus.NO_FOUND,
    });
  }

  // ========== API PUT ==========

  // ========== API DELETE ==========

  @ApiOperation({
    summary: `--- delete Duplicate download ${SongConstant.BUCKETS} in MongoDB ---`,
  })
  @Delete()
  async deleteDuplicate(): Promise<IHttpSuccess> {
    const data = await this._modelService.deleteDuplicate();
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: SongConstant.BUCKETS,
      data,
    });
  }

  @ApiOperation({
    summary: `--- delete ${SongConstant.BUCKETS} in MongoDB ---`,
  })
  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string): Promise<IHttpSuccess> {
    const data = await this._modelService.DeleteOne(filename);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: SongConstant.BUCKETS,
      data,
    });
  }
}
