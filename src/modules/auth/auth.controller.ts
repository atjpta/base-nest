import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthConstant } from './constant/auth.constant';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { BaseHttpStatus } from 'src/base/http-status';
import { IHttpSuccess, BaseResponse } from 'src/base/response';
import { UserService } from '../user/user.service';
import { UserConstant } from '../user/constant/user.constant';
import { IsPublic } from './decorators/public.decorator';
@IsPublic()
@ApiTags(AuthConstant.SWAGGER_TAG)
@Controller({ path: AuthConstant.API_PREFIX })
export class AuthController {
  constructor(
    private readonly _modelService: AuthService,
    private readonly _userService: UserService,
  ) {}

  // ========== API POST ==========

  @Post(`login`)
  @ApiOperation({ summary: `--- login ---` })
  public async login(
    @Body() body: LoginDto,
  ): Promise<IHttpSuccess | HttpException> {
    const user = await this._userService.findByUserName(body.username);
    if (!user) {
      return BaseResponse.notFound(
        UserConstant.MODEL_NAME,
        'username',
        body.username,
      );
    }
    const isMatchPassword = await this._userService.comparePasswords(
      body.password,
      user.password,
    );
    if (!isMatchPassword) {
      return BaseResponse.badRequest(
        `${UserConstant.MODEL_NAME}: Password Failed`,
      );
    }
    const result = await this._modelService.login(user);

    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: 'login',
      data: result,
    });
  }

  @Post('register')
  @ApiOperation({ summary: `--- register ---` })
  public async register(
    @Body() body: RegisterDto,
  ): Promise<IHttpSuccess | HttpException> {
    //create user
    const records = await this._modelService.register(body);
    return BaseResponse.success({
      statusCode: BaseHttpStatus.OK,
      object: 'register',
      data: records,
    });
  }

  // ========== API GET ==========

  // ========== API PUT ==========

  // ========== API DELETE ==========
}
