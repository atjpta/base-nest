import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FavoriteService } from './favorite.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { IsPublic } from '../auth/decorators/public.decorator';
import { FavoriteConstant } from './constant/favorite.constant';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { GetUserId } from '../auth/decorators/user.decorator';
@ApiBearerAuth()
@ApiTags(FavoriteConstant.SWAGGER_TAG)
@Controller({ path: FavoriteConstant.API_PREFIX })
export class FavoriteController {
  constructor(private readonly _modelService: FavoriteService) {}

  // ========== API POST ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Post(``)
  @ApiOperation({
    summary: `--- Create ${FavoriteConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Body() body: CreateFavoriteDto,
    @GetUserId() id: string,
  ): Promise<IHttpSuccess | HttpException> {
    body['createdBy'] = id;

    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: FavoriteConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========
  @Get(`modelType/:type`)
  @ApiOperation({
    summary: `--- find model ${FavoriteConstant.MODEL_NAME}  ---`,
  })
  public async findModel(
    @Param('type') type: string,
    @GetUserId() user_id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findModelByUSer(type, user_id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: FavoriteConstant.MODEL_NAME,
      data: records,
    });
  }

  @Get(`model/:id`)
  @ApiOperation({
    summary: `--- find one ${FavoriteConstant.MODEL_NAME}  ---`,
  })
  public async findOne(
    @Param('id', ValidateMongoId) id: string,
    @GetUserId() user_id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findOneByUser(id, user_id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: FavoriteConstant.MODEL_NAME,
      data: records,
    });
  }

  @IsPublic()
  @Get(`model/length/:id`)
  @ApiOperation({
    summary: `--- find one ${FavoriteConstant.MODEL_NAME}  ---`,
  })
  public async findLength(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findSlBy(id);

    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: FavoriteConstant.MODEL_NAME,
      data: { length: records },
    });
  }

  // ========== API PUT ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Put(`:id`)
  @ApiOperation({
    summary: `--- update ${FavoriteConstant.MODEL_NAME}  by id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
    @Body() body: UpdateFavoriteDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.update(id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: FavoriteConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${FavoriteConstant.MODEL_NAME}  by id ---`,
  })
  public async delete(
    @Param('id', ValidateMongoId) id: string,
    @GetUserId() user_id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeByUser(user_id, id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: FavoriteConstant.MODEL_NAME,
      data: records,
    });
  }
}