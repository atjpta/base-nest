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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { Request } from 'express';
import { QuerySearchArtistDto } from '../artist/dto/query-artist.dto';
import { IsPublic } from '../auth/decorators/public.decorator';
import { CommentConstant } from './constant/comment.constant';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetUserId } from '../auth/decorators/user.decorator';
@ApiBearerAuth()
@ApiTags(CommentConstant.SWAGGER_TAG)
@Controller({ path: CommentConstant.API_PREFIX })
export class CommentController {
  constructor(private readonly _modelService: CommentService) {}

  // ========== API POST ==========

  @Post(``)
  @ApiOperation({
    summary: `--- Create ${CommentConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Body() body: CreateCommentDto,
    @GetUserId() id: string,
  ): Promise<IHttpSuccess | HttpException> {
    body['createdBy'] = id;
    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: CommentConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========
  @IsPublic()
  @Get()
  @ApiOperation({
    summary: `--- find all ${CommentConstant.MODEL_NAME}  ---`,
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
      object: CommentConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  @IsPublic()
  @Get('model/:id')
  @ApiOperation({
    summary: `--- find all ${CommentConstant.MODEL_NAME} by id model (chưa có phân trang) ---`,
  })
  public async findAllById(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAllById(id);

    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: CommentConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API PUT ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Put(`:id`)
  @ApiOperation({
    summary: `--- update ${CommentConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Req() req: Request,
    @Body() body: UpdateCommentDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: CommentConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${CommentConstant.MODEL_NAME}  by id ---`,
  })
  public async delete(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: CommentConstant.MODEL_NAME,
      data: records,
    });
  }
}
