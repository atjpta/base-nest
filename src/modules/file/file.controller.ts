import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UploadedFile,
  HttpException,
  Get,
  Param,
  Delete,
  Res,
  StreamableFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { BaseHttpStatus } from 'src/base/http-status';
import { IHttpSuccess, BaseResponse } from 'src/base/response';
import { CreateFileDto, CreateMultipleFileDto } from './dto/file.dto';
import { FileService } from './file.service';
import { FileConstant } from './constant/file.constant';
import { Response } from 'express';
import { IsPublic } from '../auth/decorators/public.decorator';

@ApiBearerAuth()
@ApiTags(FileConstant.SWAGGER_TAG)
@Controller({ path: FileConstant.API_PREFIX })
export class FileController {
  private _prefixPath = `./${FileConstant.FOLDER}`;
  constructor(private readonly _fileService: FileService) {}

  // ========== API POST ==========

  @Post()
  @ApiOperation({ summary: `--- upload new file ---` })
  @UseInterceptors(FileInterceptor(FileConstant.FILE_FIELD_NAME))
  @ApiConsumes('multipart/form-data')
  public async uploadFile(
    @Body() body: CreateFileDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<IHttpSuccess | HttpException> {
    const fileType = `.${file.originalname.split('.')[1]}`;
    const filename = body.customName
      ? body.customName + fileType
      : file.originalname;
    const path = `./${this._prefixPath}/${filename}`;
    const existFile = await this._fileService.haveFile(path);
    if (existFile) {
      return BaseResponse.conflict(
        FileConstant.SWAGGER_TAG,
        'fileName',
        filename,
      );
    }
    await this._fileService.saveFile(file, path);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.CREATED,
      object: file.mimetype.toString(),
      data: filename,
    });
  }

  @Post('multiple')
  @ApiOperation({ summary: `--- Upload multiple files at once ---` })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor(FileConstant.FILE_FIELD_NAME))
  public async uploadFiles(
    @Body() body: CreateMultipleFileDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<IHttpSuccess | HttpException> {
    const results = [];

    for (const file of files) {
      const filename = file.originalname;

      const path = `./${this._prefixPath}/${filename}`;
      const existFile = await this._fileService.haveFile(path);

      if (existFile) {
        results.push({
          [filename]: `file already exists`,
        });
      } else {
        await this._fileService.saveFile(file, path);
        results.push({
          [filename]: `upload success!!`,
        });
      }
    }

    return BaseResponse.success({
      statusCode: BaseHttpStatus.CREATED,
      object: FileConstant.FOLDER,
      data: results,
    });
  }

  // ========== API GET ==========

  @IsPublic()
  @Get(':filename')
  @ApiOperation({ summary: `--- find file by fileName ---` })
  public async getFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ): Promise<any> {
    const filePath = join(process.cwd(), `${this._prefixPath}/${filename}`);
    res.sendFile(filePath);
  }

  @Delete(':filename')
  @ApiOperation({ summary: `--- Delete file by fileName ---` })
  public async deleteFile(
    @Param('filename') filename: string,
  ): Promise<IHttpSuccess | HttpException> {
    const result = await this._fileService.deleteFile(filename);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.DELETE,
      object: FileConstant.SWAGGER_TAG,
      data: result,
    });
  }

  @IsPublic()
  @Get(`download/:filename`)
  @ApiOperation({ summary: `--- Download file ---` })
  public async downloadFile(
    @Param('filename') filename: string,
  ): Promise<StreamableFile> {
    const path = join(process.cwd(), `${this._prefixPath}/${filename}`);
    const stream = createReadStream(path);
    return new StreamableFile(stream);
  }

  // ========== API PUT ==========

  // ========== API DELETE ==========
}
