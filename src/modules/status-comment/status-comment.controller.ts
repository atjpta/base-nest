import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatusCommentService } from './status-comment.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { CreateStatusCommentDto } from './dto/create-status-comment.dto';
import { UpdateStatusCommentDto } from './dto/update-status-comment.dto';
import { GetUserId } from '../auth/decorators/user.decorator';
import { StatusCommentConstant } from './constant/status-comment.constant';
import { QueryFindAll } from 'src/base/query-dto';
@ApiBearerAuth()
@ApiTags(StatusCommentConstant.SWAGGER_TAG)
@Controller({ path: StatusCommentConstant.API_PREFIX })
export class StatusCommentController {
  constructor(private readonly _modelService: StatusCommentService) {}

  // ========== API POST ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Post(``)
  @ApiOperation({
    summary: `--- Create ${StatusCommentConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Body() body: CreateStatusCommentDto,
    @GetUserId() id: string,
  ): Promise<IHttpSuccess | HttpException> {
    body['createdBy'] = id;
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + body.day);
    body['endTime'] = endTime.toISOString();
    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: StatusCommentConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @Get('user/:id')
  @ApiOperation({
    summary: `--- find ${StatusCommentConstant.MODEL_NAME} by user  ---`,
  })
  public async findByUser(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findByUser(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: StatusCommentConstant.MODEL_NAME,
      data: records,
    });
  }

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Get('warning')
  @ApiOperation({
    summary: `--- find all warning ${StatusCommentConstant.MODEL_NAME}  ---`,
  })
  public async findAllWarning(
    @Query() query: QueryFindAll,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAllIsWarning(
      query.page,
      query.limit,
    );
    const total = await this._modelService.findAllIsWarningCount();
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: StatusCommentConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Get('banned')
  @ApiOperation({
    summary: `--- find all banned ${StatusCommentConstant.MODEL_NAME}  ---`,
  })
  public async findAllBan(
    @Query() query: QueryFindAll,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAllIsBanned(
      query.page,
      query.limit,
    );
    const total = await this._modelService.findAllIsBannedCount();
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: StatusCommentConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  // ========== API PUT ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Put(`:id`)
  @ApiOperation({
    summary: `--- update ${StatusCommentConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() body: UpdateStatusCommentDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (body.day > 0 || body.day == -99) {
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + body.day);
      body['endTime'] = endTime.toISOString();
    }
    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: StatusCommentConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========
}
