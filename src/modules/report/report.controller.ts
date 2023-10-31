import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { GetUserId } from '../auth/decorators/user.decorator';
import { ReportConstant } from './constant/report.constant';
import { QueryFindAll } from 'src/base/query-dto';
@ApiBearerAuth()
@ApiTags(ReportConstant.SWAGGER_TAG)
@Controller({ path: ReportConstant.API_PREFIX })
export class ReportController {
  constructor(private readonly _modelService: ReportService) {}

  // ========== API POST ==========

  @Post(``)
  @ApiOperation({
    summary: `--- Create ${ReportConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Body() body: CreateReportDto,
    @GetUserId() id: string,
  ): Promise<IHttpSuccess | HttpException> {
    body['createdBy'] = id;
    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ReportConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @Get()
  @ApiOperation({
    summary: `--- find all ${ReportConstant.MODEL_NAME}  ---`,
  })
  public async findAll(
    @Query() query: QueryFindAll,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAllGroup(
      query.page,
      query.limit,
    );
    const total = await this._modelService.findAllGroupCount();
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ReportConstant.MODEL_NAME,
      data: { list: records, total: total },
    });
  }

  @Get('author/:id')
  @ApiOperation({
    summary: `--- find all ${ReportConstant.MODEL_NAME} by author  ---`,
  })
  public async findAllByAuthor(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.getOneByAuthor(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ReportConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API PUT ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Put(`:id`)
  @ApiOperation({
    summary: `--- update ${ReportConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() body: UpdateReportDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ReportConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${ReportConstant.MODEL_NAME}  by id ---`,
  })
  public async delete(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ReportConstant.MODEL_NAME,
      data: records,
    });
  }

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Delete(`author/:id`)
  @ApiOperation({
    summary: `--- Delete ${ReportConstant.MODEL_NAME}  by author id ---`,
  })
  public async deleteByAuthor(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.deleteByAuthor(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ReportConstant.MODEL_NAME,
      data: records,
    });
  }

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Delete(`comment/:id`)
  @ApiOperation({
    summary: `--- Delete ${ReportConstant.MODEL_NAME}  by comment id ---`,
  })
  public async deleteByComment(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.deleteByComment(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: ReportConstant.MODEL_NAME,
      data: records,
    });
  }
}
