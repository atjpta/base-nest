import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserConstant } from './constant/user.constant';
import { UserService } from './user.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { CreateUserDto, createNewPassword } from './dto/create-user.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { QueryFindAll } from 'src/base/query-dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { RoleService } from '../role/role.service';
import { RoleConstant } from '../role/constant/role.constant';
import { GetUserId } from '../auth/decorators/user.decorator';
import { HasRoles } from '../auth/decorators/role.decorator';
import { IsPublic } from '../auth/decorators/public.decorator';
import { ValidateMongoId } from 'src/shared/pipes/validate.pipe';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { BullConstant } from '../bull/constant/bull.constant';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

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
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: UserConstant.MODEL_NAME,
      data: records,
    });
  }

  // @IsPublic()
  // @Get('get-code')
  // @ApiOperation({
  //   summary: `--- get code re password ---`,
  // })
  // public async GetCode(
  //   @Query('email', ValidateEmail) email: string,
  // ): Promise<IHttpSuccess | HttpException> {
  //   const code1 = ~~(Math.random() * 10);
  //   const code2 = ~~(Math.random() * 10);
  //   const code3 = ~~(Math.random() * 10);
  //   const code4 = ~~(Math.random() * 10);

  //   const code = `${code1}${code2}${code3}${code4}`;
  //   await this.cacheManager.set(code, true, { ttl: 125 } as any);
  //   await this.sendMail.add(
  //     BullConstant.TASK_BULL.registerMail,
  //     {
  //       to: email,
  //       from: 'noreply@nestjs.com',
  //       subject: 'code re password',
  //       template: 'rePassword',
  //       context: {
  //         code: code,
  //       },
  //     },
  //     { removeOnComplete: true },
  //   );
  //   return BaseResponse.success({
  //     statusCode: BaseHttpStatus.OK,
  //     object: UserConstant.MODEL_NAME,
  //     data: true,
  //   });
  // }

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

  // @Put(``)
  // @ApiOperation({ summary: `--- update ${UserConstant.MODEL_NAME} by id ---` })
  // public async update(
  //   @GetUser() user: IUser,
  //   @Body() body: UpdateUserDto,
  // ): Promise<IHttpSuccess | HttpException> {
  //   const records = await this._modelService.update(user.id, body);
  //   return BaseResponse.success({
  //     statusCode: BaseHttpStatus.UPDATE,
  //     object: UserConstant.MODEL_NAME,
  //     data: records,
  //   });
  // }

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
    console.log(records);

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

  // ========== API DELETE ==========
}
