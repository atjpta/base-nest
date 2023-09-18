import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserConstant } from './constant/user.constant';
import { UserService } from './user.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { CreateUserDto, createNewPassword } from './dto/create-user.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { QueryFindAll } from 'src/base/query-dto';
import {
  UpdatePasswordDto,
  UpdateRoleUserDto,
  UpdateUserDto,
} from './dto/update-user.dto';
import { RoleService } from '../role/role.service';
import { RoleConstant } from '../role/constant/role.constant';
import { GetUserId, GetUserRole } from '../auth/decorators/user.decorator';
import { HasRoles } from '../auth/decorators/role.decorator';
import { IsPublic } from '../auth/decorators/public.decorator';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { BullConstant } from '../bull/constant/bull.constant';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { AppConfig } from 'src/configs/app.config';
import { ImageConstant } from '../image/constant/image.constant';
@ApiBearerAuth()
@ApiTags(UserConstant.SWAGGER_TAG)
@Controller({ path: UserConstant.API_PREFIX })
export class UserController {
  constructor(
    private readonly _modelService: UserService,
    private readonly _roleService: RoleService,
    @InjectQueue(BullConstant.JOB_BULL.sendEmail)
    private readonly sendMail: Queue,
    @Inject(CACHE_MANAGER) public readonly cacheManager: Cache,
  ) {}

  // ========== API POST ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Post()
  @ApiOperation({ summary: `--- Create ${UserConstant.MODEL_NAME} ---` })
  public async create(
    @Body() body: CreateUserDto,
  ): Promise<IHttpSuccess | HttpException> {
    // get id role in db
    const role = await this._roleService.findOneByField({ name: body.role });
    if (!role) {
      return BaseResponse.badRequest(RoleConstant.MODEL_NAME);
    }
    body.role = role._id;
    //create user
    const records = await this._modelService.create(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: UserConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API GET ==========

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Get()
  @ApiOperation({ summary: `--- find all ${UserConstant.MODEL_NAME} ---` })
  public async findAll(
    @Query() query: QueryFindAll,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findAllAndPopulate(
      query.page,
      query.limit,
      'role',
    );
    const total = await this._modelService.getTotalRow();
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: UserConstant.MODEL_NAME,
      data: {
        list: records,
        total,
      },
    });
  }

  @IsPublic()
  @Get('check-code')
  @ApiOperation({
    summary: `--- check code re password ---`,
  })
  public async checkCode(
    @Query('code') code: string,
  ): Promise<IHttpSuccess | HttpException> {
    const isCode = await this.cacheManager.get(code);
    if (isCode) {
      await this.cacheManager.set(code, true, { ttl: 500 } as any);
    }

    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: UserConstant.MODEL_NAME,
      data: isCode,
    });
  }

  @IsPublic()
  @Get('check-username')
  @ApiOperation({
    summary: `--- check username in db ---`,
  })
  public async checkUsername(
    @Query('username') username: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.findByUserName(username);

    if (records) {
      const code1 = ~~(Math.random() * 10);
      const code2 = ~~(Math.random() * 10);
      const code3 = ~~(Math.random() * 10);
      const code4 = ~~(Math.random() * 10);

      const code = `${code1}${code2}${code3}${code4}`;
      await this.cacheManager.set(code, true, { ttl: 125 } as any);
      await this.sendMail.add(
        BullConstant.TASK_BULL.registerMail,
        {
          to: records.email,
          from: 'noreply@nestjs.com',
          subject: 'code re password',
          template: 'rePassword',
          context: {
            code: code,
          },
        },
        { removeOnComplete: true },
      );
    }
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: UserConstant.MODEL_NAME,
      data: records,
    });
  }

  @IsPublic()
  @Get(':id')
  @ApiOperation({
    summary: `--- find One ${UserConstant.MODEL_NAME} by id ---`,
  })
  public async findOne(
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    const records = await this._modelService.getInfo(id);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: UserConstant.MODEL_NAME,
      data: records,
    });
  }

  // ========== API PUT ==========

  @Put(``)
  @ApiOperation({ summary: `--- update ${UserConstant.MODEL_NAME} ---` })
  @ApiConsumes('multipart/form-data')
  public async update(
    @Req() req: Request,
    @GetUserId() user_id: string,
    @Body() body: UpdateUserDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (req.file) {
      body.avatar = `${AppConfig.urlServer || ImageConstant.URL_API}/${
        ImageConstant.API_PREFIX
      }/${req.file.originalname}`;
    }
    const records = await this._modelService.updateUser(user_id, body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.UPDATE,
      object: UserConstant.MODEL_NAME,
      data: records,
    });
  }

  @Put(`password`)
  @ApiOperation({
    summary: `--- update password ${UserConstant.MODEL_NAME} by id ---`,
  })
  public async UpdatePasswordDto(
    @GetUserId() id: string,
    @Body() body: UpdatePasswordDto,
  ): Promise<IHttpSuccess | HttpException> {
    if (body.newPassword == body.password) {
      return BaseResponse.conflict(UserConstant.MODEL_NAME);
    }

    const userDB = await this._modelService.findOneById(id);

    if (!userDB) {
      return BaseResponse.success({
        statusCode: BaseHttpStatus.NO_FOUND,
        object: UserConstant.MODEL_NAME,
      });
    }
    const isMatchPassword = await this._modelService.comparePasswords(
      body.password,
      userDB.password,
    );
    if (!isMatchPassword) {
      return BaseResponse.badRequest(
        UserConstant.MODEL_NAME,
        `${UserConstant.MODEL_NAME}: Password Failed`,
      );
    }
    const records = await this._modelService.updatePassword(
      id,
      body.newPassword,
    );
    return BaseResponse.success({
      statusCode: BaseHttpStatus.UPDATE,
      object: UserConstant.MODEL_NAME,
      data: records,
    });
  }

  @IsPublic()
  @Put(`forget-password`)
  @ApiOperation({
    summary: `--- set new password ${UserConstant.MODEL_NAME} by username and code re password ---`,
  })
  public async createNewPassword(
    @Body() body: createNewPassword,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this._modelService.findByUserName(body.username);
    if (!user) {
      return BaseResponse.notFound(UserConstant.MODEL_NAME);
    }
    const isCode = await this.cacheManager.get(body.code);
    if (!isCode) {
      return BaseResponse.unauthorized(UserConstant.MODEL_NAME);
    }
    const records = await this._modelService.updatePassword(
      user._id,
      body.newPassword,
    );
    await this.cacheManager.del(body.code);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.UPDATE,
      object: UserConstant.MODEL_NAME,
      data: records,
    });
  }

  @HasRoles(RoleConstant.LIST_ROLES.Admin)
  @Put(`:id`)
  @ApiOperation({
    summary: `--- update Role user ${UserConstant.MODEL_NAME} ---`,
  })
  public async updateRoleUser(
    @GetUserRole() role: string,
    @Body() body: UpdateRoleUserDto,
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    let canUpdate = false;
    if (role == RoleConstant.LIST_ROLES.Root) {
      canUpdate = true;
    } else {
      const user = await this._modelService.getInfo(id);

      if (user && user.role.name == RoleConstant.LIST_ROLES.User) {
        canUpdate = true;
      }
    }
    if (canUpdate) {
      const records = await this._modelService.update(id, {
        role: this._modelService._getID(body.role),
      });
      return BaseResponse.success({
        statusCode: BaseHttpStatus.OK,
        object: UserConstant.MODEL_NAME,
        data: records,
      });
    } else {
      return BaseResponse.forbidden(UserConstant.MODEL_NAME);
    }
  }

  // ========== API DELETE ==========

  @HasRoles(RoleConstant.LIST_ROLES.Root)
  @Delete(`:id`)
  @ApiOperation({
    summary: `--- Delete user ${UserConstant.MODEL_NAME} ---`,
  })
  public async deleteUser(
    @GetUserRole() role: string,
    @Param('id', ValidateMongoId) id: string,
  ): Promise<IHttpSuccess | HttpException> {
    let canDelete = false;
    if (role == RoleConstant.LIST_ROLES.Root) {
      canDelete = true;
    } else {
      const user = await this._modelService.getInfo(id);

      if (user && user.role.name == RoleConstant.LIST_ROLES.Root) {
        return BaseResponse.notAcceptable(UserConstant.MODEL_NAME);
      }
    }
    if (canDelete) {
      const records = await this._modelService.removeById(id);
      return BaseResponse.success({
        statusCode: BaseHttpStatus.OK,
        object: UserConstant.MODEL_NAME,
        data: records,
      });
    } else {
      return BaseResponse.forbidden(UserConstant.MODEL_NAME);
    }
  }
}
