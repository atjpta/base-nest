import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { BaseHttpStatus } from 'src/base/http-status';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { RoleConstant } from '../role/constant/role.constant';
import { HasRoles } from '../auth/decorators/role.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationConstant } from './constant/notification.constant';
import { GetUserId } from '../auth/decorators/user.decorator';
@ApiBearerAuth()
@ApiTags(NotificationConstant.SWAGGER_TAG)
@Controller({ path: NotificationConstant.API_PREFIX })
export class NotificationController {
  constructor(private readonly _modelService: NotificationService) {}

  // ========== API POST ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Post(``)
  @ApiOperation({
    summary: `--- Create ${NotificationConstant.MODEL_NAME} ---`,
  })
  public async create(
    @Body() body: CreateNotificationDto,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NotificationConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @Get('user')
  @ApiOperation({
    summary: `--- find all ${NotificationConstant.MODEL_NAME} by user id (limit 50)  ---`,
  })
  public async findAllByAuthor(
    @GetUserId() id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findByUser(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NotificationConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API PUT ==========

  @Put(`user`)
  @ApiOperation({
    summary: `--- update ${NotificationConstant.MODEL_NAME}  by id ---`,
  })
  public async updateByUser(
    @GetUserId() id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.updateViewByUser(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NotificationConstant.MODEL_NAME,
      data: records,
    });
  }

  @Put(`:id`)
  @ApiOperation({
    summary: `--- update all ${NotificationConstant.MODEL_NAME}  by user id ---`,
  })
  public async update(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.update(id, { isView: true });
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NotificationConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API DELETE ==========

  @Delete(`user`)
  @ApiOperation({
    summary: `--- Delete ${NotificationConstant.MODEL_NAME}  by user id ---`,
  })
  public async deleteAll(
    @GetUserId() id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.deleteByUser(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NotificationConstant.MODEL_NAME,
      data: records,
    });
  }

  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete ${NotificationConstant.MODEL_NAME}  by id ---`,
  })
  public async deleteOne(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.removeById(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: NotificationConstant.MODEL_NAME,
      data: records,
    });
  }
}
