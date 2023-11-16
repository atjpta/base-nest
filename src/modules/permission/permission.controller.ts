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
import { PermissionService } from './permission.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionConstant } from './constant/permission.constant';
import { QueryFindAll } from 'src/base/query-dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@ApiBearerAuth()
@ApiTags(PermissionConstant.SWAGGER_TAG)
@Controller({ path: PermissionConstant.API_PREFIX })
export class PermissionController {
  constructor(private readonly _modelService: PermissionService) {}

  // ========== API POST ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Post(``)
  @ApiOperation({
    summary: `--- Create ${PermissionConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Body() body: CreatePermissionDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PermissionConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Get('user')
  @ApiOperation({
    summary: `--- find all ${PermissionConstant.MODEL_NAME}  ---`,
  })
  public async findAllByAuthor(
    @Query() query: QueryFindAll,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAll(query.page, query.limit);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PermissionConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API PUT ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Put(`:id`)
  @ApiOperation({
    summary: `--- update ${PermissionConstant.MODEL_NAME} by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() body: UpdatePermissionDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PermissionConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${PermissionConstant.MODEL_NAME} by user id ---`,
  })
  public async deleteOne(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: PermissionConstant.MODEL_NAME,
      data: records,
    });
  }
}
