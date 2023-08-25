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
import { UserConstant } from './constant/user.constant';
import { UserService } from './user.service';
import { BaseResponse, IHttpSuccess } from 'src/base/response';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { QueryFindAll } from 'src/base/query-dto';
import { UpdatePasswordDto } from './dto/update-user.dto';
import { RoleService } from '../role/role.service';
import { RoleConstant } from '../role/constant/role.constant';
import { GetUserId } from '../auth/decorators/user.decorator';
import { HasRoles } from '../auth/decorators/role.decorator';
import { IsPublic } from '../auth/decorators/public.decorator';
import { ValidateMongoId } from 'src/shared/pipes/validate-mongoId.pipe';

@ApiBearerAuth()
@ApiTags(UserConstant.SWAGGER_TAG)
@Controller({ path: UserConstant.API_PREFIX })
export class UserController {
  constructor(
    private readonly _modelService: UserService,
    private readonly _roleService: RoleService,
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
    const userDB = await this._modelService.findOneById(id);
    const isMatchPassword = await this._modelService.comparePasswords(
      body.password,
      userDB.password,
    );
    if (!isMatchPassword) {
      return BaseResponse.badRequest(
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

  // ========== API DELETE ==========
}
