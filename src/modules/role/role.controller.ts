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
import { RoleConstant } from './constant/role.constant';
import { RoleService } from './role.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { CreateRoleDto } from './dto/create-role.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { QueryFindAll } from 'src/base/query-dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ValidateMongoId } from 'src/shared/pipes/validate-mongoId.pipe';
import { HasRoles } from '../auth/decorators/role.decorator';

@ApiBearerAuth()
@HasRoles(RoleConstant.LIST_ROLES.Admin)
@ApiTags(RoleConstant.SWAGGER_TAG)
@Controller({ path: RoleConstant.API_PREFIX })
export class RoleController {
  constructor(private readonly _modelService: RoleService) {}

  // ========== API POST ==========

  @HasRoles(RoleConstant.LIST_ROLES.Root)
  @Post()
  @ApiOperation({
    summary: `--- Create ${RoleConstant.MODEL_NAME} in system ---`,
  })
  public async create(
    @Body() body: CreateRoleDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: RoleConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @HasRoles(RoleConstant.LIST_ROLES.Root)
  @Get()
  @ApiOperation({
    summary: `--- find all ${RoleConstant.MODEL_NAME}  in system ---`,
  })
  public async findAll(
    @Query() query: QueryFindAll,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAll(query.page, query.limit);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: RoleConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API PUT ==========

  @HasRoles(RoleConstant.LIST_ROLES.Root)
  @Put(`:id`)
  @ApiOperation({
    summary: `--- update ${RoleConstant.MODEL_NAME}  in system by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() body: UpdateRoleDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: RoleConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========
}
